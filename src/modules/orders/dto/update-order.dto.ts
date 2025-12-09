import { OrderStatusEnum } from '@/common/types/orders.types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(128)
  externalCode?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() senderName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() senderPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pickupAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pickupLat?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pickupLng?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() receiverName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receiverPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deliveryAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deliveryLat?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deliveryLng?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() weightKg?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() volumeM3?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() codAmount?: string;

  @ApiPropertyOptional({ enum: OrderStatusEnum })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @ApiPropertyOptional() @IsOptional() @IsInt() priority?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() promisedAt?: string;
}
