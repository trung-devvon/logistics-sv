import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateApiKeyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}
