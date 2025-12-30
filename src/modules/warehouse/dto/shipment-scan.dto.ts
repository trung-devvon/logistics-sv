import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ScanDirection } from './order-scan.dto';

export class ShipmentScanDto {
  @ApiProperty({ example: 'a7c56b9d-1d0e-4a7d-9f8c-1f2e3d4c5b6a' })
  @IsUUID()
  shipmentId!: string;

  @ApiProperty({ enum: ScanDirection, example: ScanDirection.INBOUND })
  @IsEnum(ScanDirection)
  direction!: ScanDirection;

  @ApiProperty({ example: 'c1f8b0d7-9c6a-41d2-8b51-7f0f26d2f2f1' })
  @IsUUID()
  hubId!: string;

  @ApiPropertyOptional({ example: 'Truck bay B' })
  @IsOptional()
  @IsString()
  note?: string;
}
