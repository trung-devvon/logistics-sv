/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // 1. "Tiêm" (inject) Reflector vào
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 2. Đọc "cái đánh dấu" @Roles() từ route
    // Nó sẽ lấy ra mảng ['ADMIN', 'MANAGER']
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // if not @Roles()
    // skip check
    if (!requiredRoles) {
      return true;
    }

    // 4. Lấy đối tượng user từ request (đã được JwtAuthGuard 💂 gắn vào)
    const { user } = context.switchToHttp().getRequest();

    // 5. Nếu không có user (chưa đăng nhập) -> block
    if (!user) {
      return false;
    }

    const roles =
      user.userRoles?.map((ur: { role?: { code: string } }) => ur.role?.code) ??
      [];

    return requiredRoles.some((role) => roles.includes(role));
  }
}
