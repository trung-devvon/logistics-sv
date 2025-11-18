// src/auth/strategies/local.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local'; // 1. Import Strategy từ 'passport-local'
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') { // 2. Đặt tên strategy là 'local'
  
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier',
    });
  }

  async validate(identifier: string, password: string): Promise<any> {
    
    const user = await this.authService.validateUser(identifier, password);

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không đúng');
    }
    return user;
  }
}