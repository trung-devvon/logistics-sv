import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService, // 4. Inject ConfigService
    private prisma: PrismaService,       // 5. Inject PrismaService
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
}

