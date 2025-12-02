/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { AUDIT_META_KEY } from '../audit/audit.meta';
import { AuditRepository } from '../audit/audit.repository';
import { AuditMeta } from '../audit/audit.types';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditRepo: AuditRepository,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const meta = this.reflector.get<AuditMeta>(
      AUDIT_META_KEY,
      context.getHandler(),
    );
    if (!meta) return next.handle();

    const actorUserId: string | null = (req as any).user?.sub ?? null;
    const params = req.params ?? {};
    const body = req.body ?? {};

    return next.handle().pipe(
      tap(async (res) => {
        try {
          const entityId =
            params?.id || res?.id || body?.id || body?.orgId || null;
          await this.auditRepo.write({
            actorUserId,
            entityType: meta.entity,
            entityId: entityId ? String(entityId) : null,
            action: meta.action,
            diff: body ? JSON.parse(JSON.stringify(body)) : undefined,
          });
        } catch (e) {
          // Không chặn response nếu audit fail

          console.warn('[Audit] write fail', e);
        }
      }),
    );
  }
}
