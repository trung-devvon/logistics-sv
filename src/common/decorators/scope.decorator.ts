/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ScopeContext } from '../types/scope.types';

export const Scope = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ScopeContext => {
    const req = ctx.switchToHttp().getRequest();
    const orgId =
      req.params?.id ||
      req.params?.orgId ||
      req.query?.orgId ||
      req.headers['x-org-id'];
    const hubId =
      req.params?.hubId || req.query?.hubId || req.headers['x-hub-id'];
    const regionCode = req.query?.region || req.headers['x-region-code'];
    return { orgId, hubId, regionCode } as ScopeContext;
  },
);
