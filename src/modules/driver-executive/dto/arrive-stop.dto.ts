import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ArriveStopDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}
