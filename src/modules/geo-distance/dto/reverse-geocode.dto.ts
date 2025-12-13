import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ReverseGeocodeDto {
  @ApiProperty({ example: '10.762622' })
  @IsNumberString()
  lat!: string;

  @ApiProperty({ example: '106.660172' })
  @IsNumberString()
  lng!: string;

  @ApiPropertyOptional({
    description: 'Provider (mặc định google)',
    example: 'google',
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ description: 'TTL cache (giây)', example: 86400 })
  @IsOptional()
  @IsInt()
  @Min(60)
  ttlSec?: number;
}
