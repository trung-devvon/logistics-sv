import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsNumber,
    Min,
    Max,
} from 'class-validator';

export class CreateHubDto {
    @ApiProperty({ description: 'Tên Hub/Kho', example: 'Kho Tổng Hà Nội' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        description: 'Địa chỉ chi tiết',
        example: '123 Đường ABC, Quận XYZ',
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ description: 'Vĩ độ', example: 21.0285 })
    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    lat?: number;

    @ApiPropertyOptional({ description: 'Kinh độ', example: 105.8542 })
    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    lng?: number;

    @ApiPropertyOptional({
        description: 'ID Tổ chức quản lý (nếu có)',
        example: 'uuid-string',
    })
    @IsOptional()
    @IsUUID()
    orgId?: string;
}
