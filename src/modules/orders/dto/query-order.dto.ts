import { OrderStatusEnum } from '@/common/types/orders.types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryOrderDto {
  @ApiPropertyOptional() @IsOptional() @IsString() q?: string; // search by name/phone/code
  @ApiPropertyOptional({ enum: OrderStatusEnum })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;
  @ApiPropertyOptional() @IsOptional() @IsString() createdFrom?: string; // ISO
  @ApiPropertyOptional() @IsOptional() @IsString() createdTo?: string; // ISO
  @ApiPropertyOptional({ example: 'createdAt:desc' })
  @IsOptional()
  @IsString()
  sort?: string;
  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsString()
  skip?: string;
  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsString()
  take?: string;
}
