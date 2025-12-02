import { SetMetadata, applyDecorators, UseInterceptors } from '@nestjs/common';
import { AUDIT_META_KEY } from '../audit/audit.meta';
import { AuditMeta } from '../audit/audit.types';
import { AuditLogInterceptor } from '../interceptors/audit.interceptor';

export const UseAudit = (meta: AuditMeta) =>
  applyDecorators(
    SetMetadata(AUDIT_META_KEY, meta),
    UseInterceptors(AuditLogInterceptor),
  );
