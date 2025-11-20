import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email: string; // <-- Cần thêm email để biết của ai

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'OTP', example: '123456' })
  otp: string; // <-- Đổi tên từ token thành otp

  @ApiProperty({ description: 'New password', example: 'YourNewPassword123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
export class EmailForgotPasswordDto {
  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}