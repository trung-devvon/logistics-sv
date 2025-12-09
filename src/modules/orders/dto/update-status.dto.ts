import { OrderStatusEnum } from '@/common/types/orders.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatusEnum })
  @IsEnum(OrderStatusEnum)
  toStatus: OrderStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
