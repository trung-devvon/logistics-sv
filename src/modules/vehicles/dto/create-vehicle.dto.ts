import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    IsIn,
} from 'class-validator';

export class CreateVehicleDto {
    @ApiProperty({ description: 'Biển số xe', example: '29H-12345' })
    @IsString()
    @IsNotEmpty()
    plateNumber: string;

    @ApiPropertyOptional({ description: 'Loại xe', example: 'Truck' })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiProperty({ description: 'Tải trọng (kg)', example: 1000 })
    @IsNumber()
    @Min(0)
    capacityKg: number;

    @ApiPropertyOptional({ description: 'Thể tích (m3)', example: 5.5 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    capacityM3?: number;

    @ApiProperty({
        description: 'Trạng thái xe',
        enum: ['AVAILABLE', 'IN_SERVICE', 'MAINTENANCE', 'INACTIVE'],
        example: 'AVAILABLE',
    })
    @IsString()
    @IsIn(['AVAILABLE', 'IN_SERVICE', 'MAINTENANCE', 'INACTIVE'])
    status: string;
}
