import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, MaxLength } from 'class-validator';
import { IReassignInput } from '../interfaces/assignment.interfaces';

export class ReassignRequestDto implements IReassignInput {
  @ApiProperty({ description: 'Shipment cần đổi gán', format: 'uuid' })
  @IsUUID()
  shipmentId!: string;

  @ApiPropertyOptional({ description: 'Driver mới', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({ description: 'Vehicle mới', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
