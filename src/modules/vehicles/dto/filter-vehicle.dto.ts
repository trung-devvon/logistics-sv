import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterVehicleDto {
    @ApiPropertyOptional({ description: 'Tìm theo biển số' })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({
        description: 'Lọc theo trạng thái',
        enum: ['AVAILABLE', 'IN_SERVICE', 'MAINTENANCE', 'INACTIVE'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['AVAILABLE', 'IN_SERVICE', 'MAINTENANCE', 'INACTIVE'])
    status?: string;

    @ApiPropertyOptional({
        description: 'Trang hiện tại (mặc định 1)',
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Số lượng item mỗi trang (mặc định 10)',
        default: 10,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}
