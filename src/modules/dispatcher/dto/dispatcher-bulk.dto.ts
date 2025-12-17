import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BulkItem {
  @IsUUID() shipmentId!: string;
  @IsOptional() @IsUUID() driverId?: string;
  @IsOptional() @IsUUID() vehicleId?: string;
  @IsOptional() @IsString() @MaxLength(500) note?: string;
}

export class DispatchBulkDto {
  @ApiProperty({ type: [BulkItem] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BulkItem)
  items!: BulkItem[];
}
