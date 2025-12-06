import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDriverDto {
    // GỢI Ý:
    // 1. Thêm trường userId (@IsUUID) -> Liên kết với bảng User
    // 2. Thêm trường licenseNo (@IsString) -> Số bằng lái
    // 3. (Tùy chọn) Thêm status (@IsEnum)

    @ApiProperty({ description: 'ID của User (đã đăng ký)', example: 'uuid...' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ description: 'Số bằng lái', example: '123456789' })
    @IsString()
    @IsNotEmpty()
    licenseNo: string;
}
