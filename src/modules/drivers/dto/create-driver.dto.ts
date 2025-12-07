import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';


export enum DriverStatus {
    AVAILABLE = 'AVAILABLE',
    BUSY = 'BUSY',
    OFF = 'OFF',
    SUSPENDED = 'SUSPENDED',
}

export class CreateDriverDto {
    // GỢI Ý:
    // 1. Thêm trường userId (@IsUUID) -> Liên kết với bảng User
    // 2. Thêm trường licenseNo (@IsString) -> Số bằng lái
    // 3. (Tùy chọn) Thêm status (@IsEnum)

    @ApiProperty({ description: 'ID của User (đã đăng ký)', example: 'uuid...' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: 'Số bằng lái', example: 'B2-12345678' })
    @IsString()
    @IsNotEmpty()
    licenseNo: string;

    @ApiPropertyOptional({ enum: DriverStatus, default: DriverStatus.AVAILABLE })
    @IsOptional()
    @IsEnum(DriverStatus)
    status?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    hiredAt?: string;
}
