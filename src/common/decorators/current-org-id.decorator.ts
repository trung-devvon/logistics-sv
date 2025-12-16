import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const CurrentOrgId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx
      .switchToHttp()
      .getRequest<Request & { orgId?: string; user?: any }>();
    // Ưu tiên orgId đã được middleware/guard set
    if (req.orgId) return req.orgId;

    // Hoặc lấy từ user (nếu JWT có claim orgId)
    if (req.user && typeof req.user.orgId === 'string') return req.user.orgId;

    // Hoặc lấy từ header chuẩn hoá (tùy thiết kế gateway)
    const h = req.header('x-org-id') || req.header('x-tenant-id');
    if (h && typeof h === 'string') return h;

    return undefined;
  },
);
