import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/prisma/prisma.service'; // 1. Import PrismaService
import { UsersService } from '@/modules/users/users.service'; // 2. Import UsersService

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService, // 4. Inject PrismaService
    private usersService: UsersService, // 5. Inject UsersService
  ) {
    super({
      // 6. Vẫn đọc từ Header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // BẮT BUỘC kiểm tra hết hạn
      // 7. Dùng REFRESH_SECRET
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      
      // 8. (Quan trọng) Yêu cầu hàm validate() nhận cả 'request'
      // để có thể lấy token gốc
      passReqToCallback: true, 
    });
  }

  /**
   * Thực thi khi Refresh Token hợp lệ
   * @param payload { sub: user.id, email: user.email, jti: refreshTokenId }
   */
  async validate(req: any, payload: any) {
    // 9. Kiểm tra xem Refresh Token có tồn tại trong DB không
    const refreshTokenInDb = await this.prisma.refreshToken.findUnique({
      where: {
        id: payload.jti,
      },
    });

    // 10. Nếu không tìm thấy, hoặc đã bị thu hồi (revoked) -> Lỗi
    if (!refreshTokenInDb || refreshTokenInDb.revokedAt) {
      throw new UnauthorizedException('Rft không hợp lệ or đã bị thu hồi');
    }

    const user = await this.usersService.findOneById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User không tồn tại hoặc đã bị khóa');
    }
    
    // 13. Trả về user VÀ refreshTokenId
    // Passport sẽ gắn { ...user, refreshTokenId: payload.jti } vào req.user
    delete user.userRoles; // Không cần trả về cây phân quyền ở bước này
    return { ...user, refreshTokenId: payload.jti };
  }
}