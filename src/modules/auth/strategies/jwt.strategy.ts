import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'; // 1. Import các hàm của passport-jwt
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // not skip expiration check
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * thực thi khi token hợp lệ
   * @param payload { sub: user.id, email: user.email }
   */
  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    return user
  }
}