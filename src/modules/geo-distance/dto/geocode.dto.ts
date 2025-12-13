import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class GeocodeDto {
  @ApiProperty({
    description: 'Địa chỉ raw để geocode',
    example: '123 Lê Lợi, Quận 1, TP.HCM',
  })
  @IsString()
  @MaxLength(512)
  raw!: string;

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
