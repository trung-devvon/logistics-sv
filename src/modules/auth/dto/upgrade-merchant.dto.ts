import { IsNotEmpty, IsString } from 'class-validator';

export class UpgradeMerchantDto {
    @IsString()
    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    fullName: string;

    @IsString()
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    phone: string;
}
