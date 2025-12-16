import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IAssignmentView } from '../interfaces/assignment.interfaces';

export class AssignmentViewDto implements IAssignmentView {
  @ApiProperty() id!: string;
  @ApiProperty() shipmentId!: string;
  @ApiPropertyOptional() driverId?: string | null;
  @ApiPropertyOptional() vehicleId?: string | null;
  @ApiPropertyOptional() assignedBy?: string | null;
  @ApiProperty() assignedAt!: string; // ISO
  @ApiPropertyOptional() note?: string | null;
}
