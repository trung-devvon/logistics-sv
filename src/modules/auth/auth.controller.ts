import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpgradeMerchantDto } from './dto/upgrade-merchant.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtUser } from '@/common/types/user.types';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiBody,
} from '@nestjs/swagger';
import {
  EmailForgotPasswordDto,
  PasswordResetDto,
} from './dto/password-reset.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK) //
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiOkResponse({ description: 'Đăng nhập thành công' }) // status 200
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' }) // status 400
  @ApiForbiddenResponse({ description: 'Sai email hoặc mật khẩu' }) // status 403
  @ApiConflictResponse({ description: 'Xung đột dữ liệu' }) // status 409
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-tokens')
  @ApiOperation({ summary: 'Làm mới access token và refresh token' })
  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({ description: 'Làm mới token thành công' })
  @ApiForbiddenResponse({
    description: 'Refresh token không hợp lệ hoặc đã hết hạn',
  })
  async refreshTokens(@Request() req: any) {
    const { id, refreshTokenId } = req.user;

    return this.authService.refreshTokens(id, refreshTokenId);
  }
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi OTP đặt lại mật khẩu' })
  @ApiOkResponse({ description: 'Đã gửi OTP đến email' })
  @ApiBadRequestResponse({ description: 'Email không hợp lệ' })
  async forgotPassword(@Body() dto: EmailForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
    
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Xác minh OTP và đặt lại mật khẩu mới' })
  @ApiOkResponse({ description: 'Đặt lại mật khẩu thành công' })
  @ApiBadRequestResponse({ description: 'OTP không hợp lệ hoặc đã hết hạn' })
  async resetPassword(@Body() dto: PasswordResetDto) {
    return this.authService.resetPassword(
      dto.email,
      dto.otp,
      dto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu (yêu cầu đăng nhập)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Đổi mật khẩu thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Token không hợp lệ hoặc hết hạn' })
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user.id; // Lấy ID từ Token
    return this.authService.changePassword(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất' })
  @ApiOkResponse({ description: 'Đăng xuất thành công' })
  async logout(@Request() req: any) {
    const { refreshTokenId } = req.user;

    return this.authService.logout(refreshTokenId);
  }
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới (Email/Password)' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-registration')
  @ApiOperation({ summary: 'Xác thực OTP đăng ký và kích hoạt tài khoản' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyRegistration(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyRegistration(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin user hiện tại (yêu cầu đăng nhập)' })
  @ApiOkResponse({
    description: 'Thông tin user với roles và permissions',
    schema: {
      example: {
        id: 'uuid-xxx',
        email: 'user@example.com',
        fullName: 'John Doe',
        phone: '0123456789',
        isActive: true,
        roles: ['USER', 'MERCHANT'],
        permissions: ['orders:read', 'orders:create', 'orders:update'],
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Token không hợp lệ hoặc hết hạn' })
  async getCurrentUser(@CurrentUser() user: JwtUser) {
    return this.authService.getCurrentUser(user);
  }

  @Post('upgrade-merchant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Nâng cấp tài khoản lên Merchant (cần đăng nhập)' })
  @ApiBody({ type: UpgradeMerchantDto })
  async upgradeToMerchant(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpgradeMerchantDto,
  ) {
    return this.authService.upgradeToMerchant(user.sub, dto);
  }
}
