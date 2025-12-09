import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/core/prisma/prisma.service';
import { IOrdersQueryParams } from '../interfaces/orders.interface';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data });
  }

  // READ
  findById(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  findMany(params: IOrdersQueryParams) {
    const {
      q,
      status,
      createdFrom,
      createdTo,
      skip = 0,
      take = 20,
      orderBy = { createdAt: 'desc' },
    } = params;

    return this.prisma.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { externalCode: { contains: q, mode: 'insensitive' } },
                { senderName: { contains: q, mode: 'insensitive' } },
                { senderPhone: { contains: q, mode: 'insensitive' } },
                { receiverName: { contains: q, mode: 'insensitive' } },
                { receiverPhone: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(createdFrom || createdTo
          ? {
              createdAt: {
                ...(createdFrom ? { gte: createdFrom } : {}),
                ...(createdTo ? { lte: createdTo } : {}),
              },
            }
          : {}),
      },
      skip,
      take,
      orderBy,
    });
  }

  // UPDATE
  update(id: string, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({ where: { id }, data });
  }

  // DELETE
  delete(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }

  // HISTORY
  addHistory(
    orderId: string,
    payload: {
      fromStatus?: string | null;
      toStatus?: string | null;
      changedBy?: string | null;
      note?: string | null;
    },
  ) {
    return this.prisma.orderHistory.create({
      data: {
        orderId,
        fromStatus: payload.fromStatus ?? null,
        toStatus: payload.toStatus ?? null,
        changedBy: payload.changedBy ?? null,
        note: payload.note ?? null,
      },
    });
  }

  listHistory(orderId: string) {
    return this.prisma.orderHistory.findMany({
      where: { orderId },
      orderBy: { changedAt: 'desc' },
    });
  }
}
