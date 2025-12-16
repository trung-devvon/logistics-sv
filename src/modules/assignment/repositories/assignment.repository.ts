import { Injectable } from '@nestjs/common';
import {
  IShipmentLite,
  IDriverLite,
  IVehicleLite,
  IAssignTxParams,
} from '../interfaces/repository.types';
import { PrismaService } from '@/core/prisma/prisma.service';

@Injectable()
export class AssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getShipmentOrgId(shipmentId: string): Promise<string | null> {
    const sh = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        hubOriginId: true,
        hubDestId: true,
        originHub: { select: { orgId: true } },
        destHub: { select: { orgId: true } },
      },
    });

    return sh?.originHub?.orgId ?? sh?.destHub?.orgId ?? null;
  }

  async getShipment(shipmentId: string): Promise<IShipmentLite | null> {
    const s = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        id: true,
        status: true,
        hubOriginId: true,
        hubDestId: true,
      },
    });
    return s as IShipmentLite | null;
  }

  async getAssignmentByShipment(shipmentId: string) {
    return this.prisma.vehicleAssignment.findUnique({
      where: { shipmentId: shipmentId },
    });
  }

  async getDriver(driverId: string): Promise<IDriverLite | null> {
    const d = await this.prisma.driver.findUnique({
      where: { id: driverId },
      select: { id: true, status: true },
    });
    return d as IDriverLite | null;
  }

  async getVehicle(vehicleId: string): Promise<IVehicleLite | null> {
    const v = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, status: true },
    });
    return v as IVehicleLite | null;
  }

  async driverHasActiveAssignment(driverId: string): Promise<boolean> {
    const count = await this.prisma.vehicleAssignment.count({
      where: {
        driverId,
        shipment: {
          status: { in: ['PLANNED', 'DISPATCHED', 'IN_TRANSIT'] },
        },
      },
    });
    return count > 0;
  }

  async vehicleHasActiveAssignment(vehicleId: string): Promise<boolean> {
    const count = await this.prisma.vehicleAssignment.count({
      where: {
        vehicleId,
        shipment: {
          status: { in: ['PLANNED', 'DISPATCHED', 'IN_TRANSIT'] },
        },
      },
    });
    return count > 0;
  }

  assignShipment(params: IAssignTxParams) {
    const {
      shipmentId,
      driverId = null,
      vehicleId = null,
      byUserId = null,
      note = null,
    } = params;

    return this.prisma.$transaction(async (tx) => {
      const va = await tx.vehicleAssignment.upsert({
        where: { shipmentId: shipmentId },
        create: {
          shipmentId,
          driverId,
          vehicleId,
          assignedBy: byUserId,
          assignedAt: new Date(),
        },
        update: {
          driverId,
          vehicleId,
          assignedBy: byUserId,
          assignedAt: new Date(),
        },
      });

      const sh = await tx.shipment.findUnique({ where: { id: shipmentId } });
      if (sh && sh.status === 'PLANNED') {
        await tx.shipment.update({
          where: { id: shipmentId },
          data: {
            status: 'DISPATCHED' as any,
            notes: note ?? sh.notes ?? undefined,
          },
        });
      }

      return va;
    });
  }

  unassignShipment(shipmentId: string) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.vehicleAssignment.findUnique({
        where: { shipmentId: shipmentId },
      });
      if (!existing) return null;

      await tx.vehicleAssignment.delete({ where: { shipmentId: shipmentId } });
      return existing;
    });
  }
}
