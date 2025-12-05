import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
    @ApiProperty({
        description: 'Tên gợi nhớ cho API Key',
        example: 'Integration Key for Partner X',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}
