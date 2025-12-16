import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { IAssignInput } from '../interfaces/assignment.interfaces';

export class AssignRequestDto implements IAssignInput {
  @ApiProperty({ description: 'Shipment cần gán', format: 'uuid' })
  @IsUUID()
  shipmentId!: string;

  @ApiPropertyOptional({ description: 'Driver sẽ gán', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional({ description: 'Vehicle sẽ gán', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú thao tác', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
