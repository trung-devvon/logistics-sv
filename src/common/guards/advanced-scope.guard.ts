import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ScopeRepository } from '../repository/scope.repository';

@Injectable()
export class AdvancedScopeGuard implements CanActivate {
  constructor(private readonly scopeRepo: ScopeRepository) {}

  private currentUserId(req: Request) {
    return (req as any).user?.sub ?? null;
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const userId = this.currentUserId(req);
    if (!userId) throw new ForbiddenException('UNAUTHENTICATED');

    const orgId =
      (req.params as any)?.id ||
      (req.params as any)?.orgId ||
      (req.query as any)?.orgId ||
      (req.headers as any)['x-org-id'];

    if (!orgId) return true;

    const isMember = await this.scopeRepo.isUserMemberOfOrg(userId, orgId);
    if (!isMember)
      throw new ForbiddenException('NO_SCOPE: user is not a member of org');

    const hubId =
      (req.params as any)?.hubId ||
      (req.query as any)?.hubId ||
      (req.headers as any)['x-hub-id'];

    if (hubId) {
      const { ok, regionCode } = await this.scopeRepo.hubBelongsToOrg(
        hubId,
        orgId,
      );
      if (!ok)
        throw new ForbiddenException('NO_SCOPE: hub does not belong to org');

      const regionFromReq =
        (req.query as any)?.region || (req.headers as any)['x-region-code'];
      if (regionFromReq && regionCode && regionFromReq !== regionCode) {
        throw new ForbiddenException('NO_SCOPE: hub region mismatch');
      }
    }

    return true;
  }
}
