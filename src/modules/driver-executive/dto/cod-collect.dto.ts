import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CodCollectDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}
