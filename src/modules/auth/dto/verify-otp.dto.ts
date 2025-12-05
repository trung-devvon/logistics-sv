import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
    @IsEmail({}, { message: 'Email không hợp lệ' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Mã OTP không được để trống' })
    otp: string;
}
