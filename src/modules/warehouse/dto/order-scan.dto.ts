import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum ScanDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export class OrderScanDto {
  @ApiProperty({ example: '0e4a1a2b-6a1c-4db9-a3a7-9bdbef9e4a20' })
  @IsUUID()
  orderId!: string;

  @ApiProperty({ enum: ScanDirection, example: ScanDirection.INBOUND })
  @IsEnum(ScanDirection)
  direction!: ScanDirection;

  @ApiProperty({ example: 'c1f8b0d7-9c6a-41d2-8b51-7f0f26d2f2f1' })
  @IsUUID()
  hubId!: string;

  @ApiPropertyOptional({ example: 'Dock 01' })
  @IsOptional()
  @IsString()
  note?: string;
}
