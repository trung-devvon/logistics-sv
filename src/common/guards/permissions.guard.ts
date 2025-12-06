/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const required =
      this.reflector.get<string[]>(PERMISSIONS_KEY, ctx.getHandler()) ?? [];
    if (!required.length) return true;

    const user = req.user;
    if (!user) throw new ForbiddenException('UNAUTHENTICATED');

    const granted: string[] =
      user.userRoles?.flatMap(
        (ur: any) =>
          ur.role?.rolePermissions?.map((rp: any) => rp.permission?.code) ?? [],
      ) ?? []; // JWT attach
    const ok = required.every((p) => granted.includes(p));
    if (!ok) throw new ForbiddenException('FORBIDDEN: missing permission');
    return true;
  }
}
