import { IsArray, IsOptional, IsString } from 'class-validator';

export class PodUploadDto {
  @IsArray()
  photoUrls: string[]; // để đơn giản: URL đã upload lên object storage

  @IsOptional()
  @IsString()
  signatureBase64?: string; // chữ ký (base64) nếu có

  @IsOptional()
  @IsString()
  note?: string;
}
