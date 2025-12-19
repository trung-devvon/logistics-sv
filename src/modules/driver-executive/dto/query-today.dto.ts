import { IsOptional, IsString, IsDateString } from 'class-validator';

export class QueryTodayDto {
  @IsOptional()
  @IsDateString()
  date?: string; // default: today theo timezone hệ thống

  @IsOptional()
  @IsString()
  hubId?: string; // nếu muốn lọc theo hub
}
