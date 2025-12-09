import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-status.dto';
import { OrderStatusEnum } from '@/common/types/orders.types';
import { Prisma } from '@prisma/client';
import { OrderRepository } from './repos/orders.repository';
import { IOrdersSearchParams } from './interfaces/orders.interface';

const ALLOWED_NEXT: Record<OrderStatusEnum, OrderStatusEnum[]> = {
  [OrderStatusEnum.CREATED]: [OrderStatusEnum.ASSIGNED],
  [OrderStatusEnum.ASSIGNED]: [
    OrderStatusEnum.IN_TRANSIT,
    OrderStatusEnum.FAILED,
    OrderStatusEnum.RETURNED,
  ],
  [OrderStatusEnum.IN_TRANSIT]: [
    OrderStatusEnum.DELIVERED,
    OrderStatusEnum.FAILED,
    OrderStatusEnum.RETURNED,
  ],
  [OrderStatusEnum.DELIVERED]: [],
  [OrderStatusEnum.FAILED]: [OrderStatusEnum.RETURNED], // ví dụ quy trình hoàn
  [OrderStatusEnum.RETURNED]: [],
};

@Injectable()
export class OrderService {
  constructor(private readonly repo: OrderRepository) {}

  async create(dto: CreateOrderDto, actorUserId: string) {
    const status = dto.status ?? OrderStatusEnum.CREATED;

    const created = await this.repo.create({
      externalCode: dto.externalCode,
      senderName: dto.senderName,
      senderPhone: dto.senderPhone,
      pickupAddress: dto.pickupAddress,
      pickupLat: dto.pickupLat ? new Prisma.Decimal(dto.pickupLat) : null,
      pickupLng: dto.pickupLng ? new Prisma.Decimal(dto.pickupLng) : null,
      receiverName: dto.receiverName,
      receiverPhone: dto.receiverPhone,
      deliveryAddress: dto.deliveryAddress,
      deliveryLat: dto.deliveryLat ? new Prisma.Decimal(dto.deliveryLat) : null,
      deliveryLng: dto.deliveryLng ? new Prisma.Decimal(dto.deliveryLng) : null,
      weightKg: dto.weightKg ? new Prisma.Decimal(dto.weightKg) : null,
      volumeM3: dto.volumeM3 ? new Prisma.Decimal(dto.volumeM3) : null,
      codAmount: dto.codAmount ? new Prisma.Decimal(dto.codAmount) : null,
      status,
      priority: dto.priority ?? 0,
      promisedAt: dto.promisedAt ? new Date(dto.promisedAt) : null,
    } as any);

    await this.repo.addHistory(created.id, {
      fromStatus: null,
      toStatus: status,
      changedBy: actorUserId,
      note: 'created',
    });

    return created;
  }

  async getById(id: string, _actorUserId: string) {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async search(params: IOrdersSearchParams) {
    const orderBy = (() => {
      const [field, dir] = (params.sort ?? 'createdAt:desc').split(':');
      return { [field]: dir === 'asc' ? 'asc' : 'desc' } as any;
    })();

    return this.repo.findMany({
      q: params.q,
      status: params.status,
      createdFrom: params.createdFrom
        ? new Date(params.createdFrom)
        : undefined,
      createdTo: params.createdTo ? new Date(params.createdTo) : undefined,
      skip: params.skip ?? 0,
      take: params.take ?? 20,
      orderBy,
    });
  }

  async update(id: string, dto: UpdateOrderDto, actorUserId: string) {
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException('Order not found');

    // Nếu đổi status trong update tổng quát, kiểm tra transition
    if (dto.status && dto.status !== (current.status as OrderStatusEnum)) {
      this.ensureTransition(current.status as OrderStatusEnum, dto.status);
    }

    const updated = await this.repo.update(id, {
      externalCode: dto.externalCode ?? current.externalCode,
      senderName: dto.senderName ?? current.senderName,
      senderPhone: dto.senderPhone ?? current.senderPhone,
      pickupAddress: dto.pickupAddress ?? current.pickupAddress,
      pickupLat: dto.pickupLat
        ? new Prisma.Decimal(dto.pickupLat)
        : current.pickupLat,
      pickupLng: dto.pickupLng
        ? new Prisma.Decimal(dto.pickupLng)
        : current.pickupLng,
      receiverName: dto.receiverName ?? current.receiverName,
      receiverPhone: dto.receiverPhone ?? current.receiverPhone,
      deliveryAddress: dto.deliveryAddress ?? current.deliveryAddress,
      deliveryLat: dto.deliveryLat
        ? new Prisma.Decimal(dto.deliveryLat)
        : current.deliveryLat,
      deliveryLng: dto.deliveryLng
        ? new Prisma.Decimal(dto.deliveryLng)
        : current.deliveryLng,
      weightKg: dto.weightKg
        ? new Prisma.Decimal(dto.weightKg)
        : current.weightKg,
      volumeM3: dto.volumeM3
        ? new Prisma.Decimal(dto.volumeM3)
        : current.volumeM3,
      codAmount: dto.codAmount
        ? new Prisma.Decimal(dto.codAmount)
        : current.codAmount,
      status: dto.status ?? current.status,
      priority:
        typeof dto.priority === 'number' ? dto.priority : current.priority,
      promisedAt: dto.promisedAt
        ? new Date(dto.promisedAt)
        : current.promisedAt,
    } as any);

    if (dto.status && dto.status !== (current.status as OrderStatusEnum)) {
      await this.repo.addHistory(id, {
        fromStatus: current.status,
        toStatus: dto.status,
        changedBy: actorUserId,
        note: 'update.status',
      });
    }

    return updated;
  }

  async changeStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    actorUserId: string,
  ) {
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException('Order not found');

    const from = current.status as OrderStatusEnum;
    const to = dto.toStatus;

    this.ensureTransition(from, to);

    const updated = await this.repo.update(id, { status: to } as any);
    await this.repo.addHistory(id, {
      fromStatus: from,
      toStatus: to,
      changedBy: actorUserId,
      note: dto.note ?? undefined,
    });

    return updated;
  }

  async delete(id: string) {
    // Nếu cần ràng buộc: chỉ xoá khi CREATED/FAILED/RETURNED
    return this.repo.delete(id);
  }

  async history(id: string) {
    return this.repo.listHistory(id);
  }

  private ensureTransition(from: OrderStatusEnum, to: OrderStatusEnum) {
    const allow = ALLOWED_NEXT[from] || [];
    if (!allow.includes(to)) {
      throw new BadRequestException(
        `Transition ${from} -> ${to} is not allowed`,
      );
    }
  }
}
