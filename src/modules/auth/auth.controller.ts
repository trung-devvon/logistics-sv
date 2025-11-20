import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

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
} from '@nestjs/swagger';
import { EmailForgotPasswordDto, PasswordResetDto } from './dto/password-reset.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK) //
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiOkResponse({ description: 'Đăng nhập thành công' }) // status 200
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' }) // status 400
  @ApiForbiddenResponse({ description: 'Sai email hoặc mật khẩu' }) // status 403
  @ApiConflictResponse({ description: 'Xung đột dữ liệu' }) // status 409
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    const data = await this.authService.login(req.user);

    return {
      message: 'Đăng nhập thành công',
      data: data,
    };
  }
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-tokens')
  @ApiOperation({ summary: 'Làm mới access token và refresh token' })
  @ApiBearerAuth('refresh-token')
  @ApiOkResponse({ description: 'Làm mới token thành công' })
  @ApiForbiddenResponse({ description: 'Refresh token không hợp lệ hoặc đã hết hạn' })
  async refreshTokens(@Request() req: any) {
    const { id, refreshTokenId } = req.user;

    const data = await this.authService.refreshTokens(id, refreshTokenId);

    return {
      message: 'Làm mới token thành công',
      data,
    };
  }
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi OTP đặt lại mật khẩu' })
  @ApiOkResponse({ description: 'Đã gửi OTP đến email' })
  @ApiBadRequestResponse({ description: 'Email không hợp lệ' })
  async forgotPassword(@Body() dto: EmailForgotPasswordDto) {
    const response = await this.authService.forgotPassword(dto.email);
    return {
      message: response.message,
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Xác minh OTP và đặt lại mật khẩu mới' })
  @ApiOkResponse({ description: 'Đặt lại mật khẩu thành công' })
  @ApiBadRequestResponse({ description: 'OTP không hợp lệ hoặc đã hết hạn' })
  async resetPassword(@Body() dto: PasswordResetDto) {
    const response = await this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
    return {
      message: response.message,
    }
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

    const data = await this.authService.logout(refreshTokenId);

    return {
      message: data.message
    };
  }
}