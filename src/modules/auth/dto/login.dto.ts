import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  
  @ApiProperty({ description: 'Nhập Email hoặc Số điện thoại', example: 'user@example.com' })
  @IsString()
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  identifier: string;

  @ApiProperty({ description: 'Mật khẩu', example: 'YourPassword123' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  password: string;
}