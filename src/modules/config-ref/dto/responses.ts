import { ApiProperty } from '@nestjs/swagger';

export class RegionRow {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiProperty() active!: boolean;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class ListRegionsResponse {
  @ApiProperty({ type: [RegionRow] }) items!: RegionRow[];
  @ApiProperty({ nullable: true }) nextCursor!: string | null;
}

export class ServiceLevelRow {
  @ApiProperty() id!: string;
  @ApiProperty() orgId!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiProperty() active!: boolean;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class ListServiceLevelsResponse {
  @ApiProperty({ type: [ServiceLevelRow] }) items!: ServiceLevelRow[];
  @ApiProperty({ nullable: true }) nextCursor!: string | null;
}
