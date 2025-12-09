import { OrderStatusEnum } from '@/common/types/orders.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ description: 'Mã từ hệ thống đối tác' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  externalCode?: string;

  // Sender
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  senderName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  senderPhone?: string; // không ép @IsPhoneNumber vì nhiều format nội địa

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiPropertyOptional({ example: '10.762622' })
  @IsOptional()
  @IsString()
  pickupLat?: string; // map vào Decimal

  @ApiPropertyOptional({ example: '106.660172' })
  @IsOptional()
  @IsString()
  pickupLng?: string;

  // Receiver
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiverName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiverPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiPropertyOptional({ example: '10.762622' })
  @IsOptional()
  @IsString()
  deliveryLat?: string;

  @ApiPropertyOptional({ example: '106.660172' })
  @IsOptional()
  @IsString()
  deliveryLng?: string;

  @ApiPropertyOptional({ example: '2.5', description: 'kg' })
  @IsOptional()
  @IsString()
  weightKg?: string;

  @ApiPropertyOptional({ example: '0.02', description: 'm3' })
  @IsOptional()
  @IsString()
  volumeM3?: string;

  @ApiPropertyOptional({ example: '150000' })
  @IsOptional()
  @IsString()
  codAmount?: string;

  @ApiPropertyOptional({
    enum: OrderStatusEnum,
    default: OrderStatusEnum.CREATED,
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @ApiPropertyOptional({ description: '0 = normal, 1 = high ...' })
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiPropertyOptional({
    description: 'ISO datetime promised',
    example: '2025-12-31T17:00:00+07:00',
  })
  @IsOptional()
  @IsString()
  promisedAt?: string;
}
