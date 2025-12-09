import { OrderStatusEnum } from '@/common/types/orders.types';
import { Prisma } from '@prisma/client';

export interface IOrdersQueryParams {
  q?: string;
  status?: OrderStatusEnum;
  createdFrom?: Date;
  createdTo?: Date;
  skip?: number;
  take?: number;
  orderBy?: Prisma.OrderOrderByWithRelationInput;
}

export interface IOrdersSearchParams {
  q?: string;
  status?: OrderStatusEnum;
  createdFrom?: string;
  createdTo?: string;
  skip?: number;
  take?: number;
  sort?: string;
}
