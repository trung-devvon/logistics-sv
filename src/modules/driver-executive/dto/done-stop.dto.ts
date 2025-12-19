import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class DoneStopDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  codReceived?: number; // nếu giao thành công thu COD ngay

  @IsOptional()
  @IsBoolean()
  requirePod?: boolean; // nếu true, chặn done khi chưa có POD
}
