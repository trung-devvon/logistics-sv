import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid'
import { MailService } from '@/integrations/mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService, // 4. Inject ConfigService
    private prisma: PrismaService,       // 5. Inject PrismaService
    private mailService: MailService
  ) {}
  /**
   * call by LocalStrategy
   * @param email Email 
   * @param pass
   * @returns user or null
   */
  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByIdentifier(identifier);

    if (user && user.passwordHash) {
      const isMatch = await argon2.verify(user.passwordHash, pass);

      if (isMatch) {
        // 4. Xóa passwordHash trước khi trả về
        delete user.passwordHash; 
        return user;
      }
    }
    return null;
 
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const { accessToken, refreshToken, refreshTokenId } = await this.generateTokens(payload);
    await this.updateRefreshToken(user.id, refreshToken, refreshTokenId); // <-- Truyền ID vào
    return { accessToken, refreshToken }; // <-- Vẫn chỉ trả 2 token cho client
  }

  async logout(refreshTokenId: string) {
    try {
      await this.prisma.refreshToken.delete({
        where: {
          id: refreshTokenId,
        },
      });
      return { message: 'Đăng xuất thành công' };
    } catch (error) {
      return { message: 'Đã đăng xuất' };
    }
  }

  async refreshTokens(userId: string, refreshTokenId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isActive: true }
    });
    if (!user || !user.isActive) {
      throw new Error('User không tồn tại hoặc đã bị khóa');
    }

    const payload = {
      email: user.email,
      sub: user.id,
    };
    const newAccessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') as string,
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') as any,
    });

    return {
      accessToken: newAccessToken,
    };
  }

  private async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<any>('JWT_EXPIRES_IN'),
    });
    const refreshTokenId = uuidv4();

    const refreshToken = this.jwtService.sign(
      { ...payload, jti: refreshTokenId }, // jti (JWT ID) là 1 id duy nhất cho token này
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<any>('JWT_REFRESH_EXPIRES_IN'),
      },
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenId
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string, refreshTokenId: string) {
    const hashedToken = await argon2.hash(refreshToken);

    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
    const expiresAt = new Date();

    if (expiresIn.endsWith('d')) {
      const days = parseInt(expiresIn.replace('d', ''));
      expiresAt.setDate(expiresAt.getDate() + days);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7); // Mặc định 7 ngày
    }

    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    await this.prisma.refreshToken.create({
      data: {
        id: refreshTokenId, // <-- 
        userId: userId,
        tokenHash: hashedToken,
        expiresAt: expiresAt,
      },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email not found'); // 404
    }
    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated'); // 403
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2); // 2 phút

    await this.prisma.passwordReset.deleteMany({ where: { userId: user.id } });

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: otpHash,
        expiresAt: expiresAt,
      },
    });

    // Dùng try-catch để không làm crash app nếu mail server lỗi
    try {
      await this.mailService.sendUserConfirmation(user.email, user.fullName, otp);
    } catch (error) {
      console.error('Lỗi gửi mail:', error);
      throw new Error('Không thể gửi email xác thực.');
    }

    return { message: 'Mã OTP đã được gửi đến email của bạn.' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email not found'); // 404
    }
    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated'); // 403
    }

    const resetRecord = await this.prisma.passwordReset.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRecord) {
      throw new UnauthorizedException('Không tìm thấy yêu cầu đặt lại mật khẩu.');
    }
    if (resetRecord.usedAt) {
      throw new UnauthorizedException('Mã OTP đã được sử dụng.');
    }
    if (resetRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Mã OTP đã hết hạn.');
    }

    // check otp
    const isValidOTP = await argon2.verify(resetRecord.token, otp);
    if (!isValidOTP) {
      throw new UnauthorizedException('Mã OTP không chính xác.');
    }

    const newPasswordHash = await argon2.hash(newPassword, {
          type: argon2.argon2id,
          timeCost: 3,
          memoryCost: 4096, // 4096 KB = 4 MB
          parallelism: 1,
        });
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      }),
      this.prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      }),
    ])

    return { message: 'Đặt lại mật khẩu thành công.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('User does not exist.');
    }

    const isMatch = await argon2.verify(user.passwordHash, dto.oldPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect.');
    }

    const newPasswordHash = await argon2.hash(dto.newPassword, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 4096, // 4096 KB = 4 MB
      parallelism: 1,
    });

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      }),
      // Thu hồi tất cả phiên đăng nhập
      this.prisma.refreshToken.deleteMany({
        where: { userId: userId },
      }),
    ]);

    return { message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' };
  }
}

