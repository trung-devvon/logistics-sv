import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DriverStatus } from './create-driver.dto';

export class FilterDriverDto {
    @ApiPropertyOptional({ enum: DriverStatus })
    @IsOptional()
    @IsEnum(DriverStatus)
    status?: string;

    @ApiPropertyOptional({ description: 'Tìm theo tên, số điện thoại' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsInt()
    page?: number;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @IsInt()
    limit?: number;
}