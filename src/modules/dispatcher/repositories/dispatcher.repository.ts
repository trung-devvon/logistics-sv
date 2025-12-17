import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  IUnassignedShipmentLite,
  IDispatcherCandidateDriver,
  IDispatcherCandidateVehicle,
} from '../interfaces/dispatcher.interface';

@Injectable()
export class DispatcherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUnassignedShipments(
    orgId: string,
    hubId?: string,
    since?: Date,
    until?: Date,
    limit = 50,
    offset = 0,
  ): Promise<IUnassignedShipmentLite[]> {
    // Shipment chưa có vehicle_assignment
    const rows = await this.prisma.shipment.findMany({
      where: {
        OR: [{ originHub: { orgId } }, { destHub: { orgId } }],
        assignment: null,
        status: { in: ['PLANNED', 'DISPATCHED'] },
        ...(hubId
          ? { OR: [{ hubOriginId: hubId }, { hubDestId: hubId }] }
          : {}),
        ...(since || until
          ? {
              plannedStart: {
                ...(since ? { gte: since } : {}),
                ...(until ? { lte: until } : {}),
              },
            }
          : {}),
      },
      select: {
        id: true,
        type: true,
        status: true,
        hubOriginId: true,
        hubDestId: true,
        plannedStart: true,
        shipmentOrders: {
          select: {
            order: {
              select: {
                promisedAt: true,
                weightKg: true,
                volumeM3: true,
              },
            },
          },
        },
      },
      orderBy: [{ plannedStart: 'asc' }],
      take: limit,
      skip: offset,
    });

    return rows.map((r) => {
      const orders = r.shipmentOrders?.map((x) => x.order) ?? [];
      const promisedAtMax = orders.reduce<Date | null>((acc, o) => {
        if (!o?.promisedAt) return acc;
        return acc ? (o.promisedAt > acc ? o.promisedAt : acc) : o.promisedAt;
      }, null);
      const totalWeight = orders.reduce(
        (acc, o) => acc + Number(o?.weightKg ?? 0),
        0,
      );
      const totalVolume = orders.reduce(
        (acc, o) => acc + Number(o?.volumeM3 ?? 0),
        0,
      );

      return {
        id: r.id,
        type: r.type,
        status: r.status,
        hubOriginId: r.hubOriginId,
        hubDestId: r.hubDestId,
        plannedStart: r.plannedStart,
        promisedAtMax: promisedAtMax ?? null,
        ordersCount: orders.length,
        totalWeightKg: String(totalWeight),
        totalVolumeM3: String(totalVolume),
      } as IUnassignedShipmentLite;
    });
  }

  async findAvailableDrivers(
    orgId: string,
    hubId?: string,
  ): Promise<IDispatcherCandidateDriver[]> {
    // Lấy driver thuộc org qua join Order/Hub? Ở đây giả sử mọi driver thuộc org qua quan hệ UserOrg hoặc policy tầng service.
    // Đơn giản: lấy tất cả driver AVAILABLE, + đếm assignment đang active.
    const drivers = await this.prisma.driver.findMany({
      where: { status: 'AVAILABLE' },
      select: {
        id: true,
        status: true,
        assignments: {
          where: {
            shipment: {
              status: { in: ['PLANNED', 'DISPATCHED', 'IN_TRANSIT'] },
            },
          },
          select: { id: true },
        },
        _count: {
          select: {
            assignments: {
              where: {
                shipment: {
                  status: { in: ['PLANNED', 'DISPATCHED', 'IN_TRANSIT'] },
                },
              },
            },
          },
        },
      },
      take: 300,
    });

    // Lấy vị trí cuối cùng nếu cần: demo nhẹ (có thể tối ưu bằng raw SQL)
    const enriched = await Promise.all(
      drivers.map(async (d) => {
        const lastLoc = await this.prisma.vehicleLocation.findFirst({
          where: { vehicle: { assignments: { some: { driverId: d.id } } } },
          orderBy: { recordedAt: 'desc' },
          select: { recordedAt: true, lat: true, lng: true },
        });
        return {
          id: d.id,
          status: d.status,
          activeAssignmentCount: d._count.assignments,
          lastLocationAt: lastLoc?.recordedAt ?? null,
          lastLat: lastLoc?.lat ? Number(lastLoc.lat) : null,
          lastLng: lastLoc?.lng ? Number(lastLoc.lng) : null,
        } as IDispatcherCandidateDriver;
      }),
    );

    return enriched;
  }

  async findAvailableVehicles(
    orgId: string,
    hubId?: string,
  ): Promise<IDispatcherCandidateVehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { status: { in: ['AVAILABLE', 'IN_SERVICE'] } },
      select: {
        id: true,
        status: true,
        capacityKg: true,
        capacityM3: true,
        _count: {
          select: {
            assignments: {
              where: {
                shipment: {
                  status: { in: ['PLANNED', 'DISPATCHED', 'IN_TRANSIT'] },
                },
              },
            },
          },
        },
      },
      take: 300,
    });

    return vehicles.map((v) => ({
      id: v.id,
      status: v.status,
      capacityKg: v.capacityKg ? String(v.capacityKg) : null,
      capacityM3: v.capacityM3 ? String(v.capacityM3) : null,
      activeAssignmentCount: v._count.assignments,
    }));
  }
}
