import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class BoardQueryDto {
  @ApiPropertyOptional({ description: 'Lọc theo hub', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  hubId?: string;

  @ApiPropertyOptional({ description: 'Lọc theo region (code)' })
  @IsOptional()
  regionCode?: string;

  @ApiPropertyOptional({ description: 'Thời điểm từ (ISO)' })
  @IsOptional()
  @IsDateString()
  since?: string;

  @ApiPropertyOptional({ description: 'Thời điểm đến (ISO)' })
  @IsOptional()
  @IsDateString()
  until?: string;

  @ApiPropertyOptional({ default: 50, minimum: 1, maximum: 200 })
  @IsOptional()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiPropertyOptional({ default: 0, minimum: 0 })
  @IsOptional()
  @Min(0)
  offset?: number = 0;
}
