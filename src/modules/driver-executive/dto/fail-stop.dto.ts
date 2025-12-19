import { IsString, IsOptional } from 'class-validator';

export class FailStopDto {
  @IsString()
  reason: string; // mã lý do (ví dụ: RECEIVER_ABSENT, ADDRESS_INVALID...)

  @IsOptional()
  @IsString()
  note?: string;
}
