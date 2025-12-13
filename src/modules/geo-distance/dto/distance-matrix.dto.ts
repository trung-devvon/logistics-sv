import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class DistanceMatrixDto {
  @ApiProperty({
    description: 'Khoá điểm đi (lat,lng hoặc địa chỉ/hub code)',
    example: '10.762622,106.660172',
  })
  @IsString()
  @MaxLength(256)
  fromKey!: string;

  @ApiProperty({
    description: 'Khoá điểm đến (lat,lng hoặc địa chỉ/hub code)',
    example: '10.781111,106.699999',
  })
  @IsString()
  @MaxLength(256)
  toKey!: string;

  @ApiPropertyOptional({
    description: 'Provider (mặc định google)',
    example: 'google',
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ description: 'TTL cache (giây)', example: 3600 })
  @IsOptional()
  @IsInt()
  @Min(60)
  ttlSec?: number;
}
