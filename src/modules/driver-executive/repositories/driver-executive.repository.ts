import { PrismaService } from '@/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverExecutiveRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDriverByUserId(userId: string) {
    return this.prisma.driver.findUnique({ where: { userId } });
  }

  async findTodayShipmentsForDriver(driverId: string, dateISO?: string) {
    // lấy các shipment của driver trong ngày (plannedStart cùng ngày hoặc status đang chạy)
    const start = dateISO ? new Date(dateISO) : new Date();
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(start);
    dayEnd.setHours(23, 59, 59, 999);

    const assignments = await this.prisma.vehicleAssignment.findMany({
      where: {
        driverId,
        assignedAt: { gte: dayStart, lte: dayEnd },
      },
      select: {
        shipment: {
          select: {
            id: true,
            type: true,
            status: true,
            plannedStart: true,
            plannedEnd: true,
            routeStops: {
              orderBy: { sequenceNo: 'asc' },
              select: {
                id: true,
                sequenceNo: true,
                stopType: true,
                status: true,
                eta: true,
                ata: true,
                address: true,
                orderId: true,
              },
            },
          },
        },
      },
      orderBy: { assignedAt: 'asc' },
    });

    return assignments.map((a) => a.shipment);
  }

  async getRouteStopById(stopId: string) {
    return this.prisma.routeStop.findUnique({
      where: { id: stopId },
      include: { pod: true, shipment: true, order: true },
    });
  }

  async setStopArrived(
    stopId: string,
    userId: string,
    note?: string,
    lat?: number,
    lng?: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const rs = await tx.routeStop.update({
        where: { id: stopId },
        data: { status: 'ARRIVED', ata: now },
      });
      await tx.stopEvent.create({
        data: {
          routeStopId: stopId,
          eventType: 'stop.arrived',
          payload:
            lat != null && lng != null
              ? { note, lat, lng }
              : note
                ? { note }
                : {},
          createdBy: userId,
        },
      });
      return rs;
    });
  }

  async setStopDone(stopId: string, userId: string, note?: string) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const rs = await tx.routeStop.update({
        where: { id: stopId },
        data: { status: 'DONE', ata: now },
      });
      await tx.stopEvent.create({
        data: {
          routeStopId: stopId,
          eventType: 'stop.done',
          payload: note ? { note } : {},
          createdBy: userId,
        },
      });

      // nếu có order liên kết, cập nhật order status
      const rsFull = await tx.routeStop.findUnique({
        where: { id: stopId },
        select: { orderId: true, stopType: true },
      });
      if (rsFull?.orderId) {
        const toStatus =
          rsFull.stopType === 'PICKUP' ? 'ASSIGNED' : 'DELIVERED';
        await tx.orderHistory.create({
          data: {
            orderId: rsFull.orderId,
            fromStatus: null,
            toStatus,
            changedBy: userId,
            note: 'Auto by driver stop.done',
          },
        });
        await tx.order.update({
          where: { id: rsFull.orderId },
          data: { status: toStatus },
        });
      }

      return rs;
    });
  }

  async setStopFailed(
    stopId: string,
    userId: string,
    reason: string,
    note?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const rs = await tx.routeStop.update({
        where: { id: stopId },
        data: { status: 'FAILED', ata: now },
      });
      await tx.stopEvent.create({
        data: {
          routeStopId: stopId,
          eventType: 'stop.failed',
          payload: { reason, note },
          createdBy: userId,
        },
      });

      // nếu có order liên kết → chuyển trạng thái FAILED
      const rsFull = await tx.routeStop.findUnique({
        where: { id: stopId },
        select: { orderId: true },
      });
      if (rsFull?.orderId) {
        await tx.orderHistory.create({
          data: {
            orderId: rsFull.orderId,
            fromStatus: null,
            toStatus: 'FAILED',
            changedBy: userId,
            note: reason,
          },
        });
        await tx.order.update({
          where: { id: rsFull.orderId },
          data: { status: 'FAILED' },
        });
      }

      return rs;
    });
  }

  async ensurePod(stopId: string) {
    return this.prisma.proofOfDelivery.findUnique({
      where: { routeStopId: stopId },
    });
  }

  async upsertPod(
    stopId: string,
    photoUrls: string[],
    signatureBase64?: string,
    note?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const pod = await tx.proofOfDelivery.upsert({
        where: { routeStopId: stopId },
        update: {
          photos: photoUrls?.length ? photoUrls : undefined,
          signature: signatureBase64,
          note,
        },
        create: {
          routeStopId: stopId,
          photos: photoUrls?.length ? photoUrls : undefined,
          signature: signatureBase64,
          note,
        },
      });
      await tx.stopEvent.create({
        data: {
          routeStopId: stopId,
          eventType: 'delivery.proof.received',
          payload: {
            photoCount: photoUrls?.length ?? 0,
            hasSignature: !!signatureBase64,
            note,
          },
          createdBy: null,
        },
      });
      return pod;
    });
  }

  async collectCOD(
    routeStopId: string,
    driverId: string | null,
    amount: number,
    userId: string | null,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const rs = await tx.routeStop.findUnique({
        where: { id: routeStopId },
        select: { orderId: true },
      });
      if (!rs?.orderId) throw new Error('No order linked to this stop');

      const cod = await tx.cODTransaction.create({
        data: {
          orderId: rs.orderId,
          routeStopId,
          driverId,
          amount,
        },
      });

      await tx.stopEvent.create({
        data: {
          routeStopId,
          eventType: 'cod.collected',
          payload: { amount },
          createdBy: userId,
        },
      });

      return cod;
    });
  }
}
