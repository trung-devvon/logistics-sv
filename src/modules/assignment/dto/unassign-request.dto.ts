import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { IUnassignInput } from '../interfaces/assignment.interfaces';

export class UnassignRequestDto implements IUnassignInput {
  @ApiProperty({ description: 'Shipment cần bỏ gán', format: 'uuid' })
  @IsUUID()
  shipmentId!: string;

  @ApiPropertyOptional({ description: 'Ghi chú', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
