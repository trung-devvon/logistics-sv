import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token (hết hạn trong 15 phút)',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh Token (hết hạn trong 7 ngày)',
  })
  refreshToken: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'Đăng nhập thành công' })
  message: string;

  @ApiProperty({ type: TokenResponseDto })
  data: TokenResponseDto;
}

export class UserInfoDto {
  @ApiProperty({ example: 'uuid-xxx' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string | null;

  @ApiProperty({ example: '0123456789' })
  phone: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: ['USER', 'MERCHANT'] })
  roles: string[];

  @ApiProperty({ example: ['orders:read', 'orders:create'] })
  permissions: string[];
}

export class MeResponseDto {
  @ApiProperty({ type: UserInfoDto })
  data: UserInfoDto;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác thực.',
  })
  message: string;

  @ApiProperty({ example: 'uuid-xxx' })
  userId: string;
}

export class VerifyRegistrationResponseDto {
  @ApiProperty({ example: 'Đăng nhập thành công' })
  message: string;

  @ApiProperty({ type: TokenResponseDto })
  data: TokenResponseDto;
}

export class RefreshTokensResponseDto {
  @ApiProperty({ example: 'Làm mới access token thành công' })
  message: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access Token mới',
  })
  accessToken: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Đăng xuất thành công' })
  message: string;
}

export class ChangePasswordResponseDto {
  @ApiProperty({ example: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' })
  message: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: 'Mã OTP đã được gửi đến email của bạn.' })
  message: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({ example: 'Đặt lại mật khẩu thành công.' })
  message: string;
}

export class UpgradeMerchantResponseDto {
  @ApiProperty({ example: 'Nâng cấp tài khoản Merchant thành công' })
  message: string;
}
