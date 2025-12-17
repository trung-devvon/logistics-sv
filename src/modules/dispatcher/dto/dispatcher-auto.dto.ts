import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class DispatchAutoDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  shipmentId!: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
