import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterHubDto {
    @ApiPropertyOptional({ description: 'Tìm kiếm theo tên hoặc địa chỉ' })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({ description: 'Lọc theo ID Tổ chức' })
    @IsOptional()
    @IsUUID()
    orgId?: string;

    @ApiPropertyOptional({ description: 'Trang hiện tại (mặc định 1)', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Số lượng item mỗi trang (mặc định 10)', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}
