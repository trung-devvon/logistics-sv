import { AuditAction } from '../types/audit.types';

export interface AuditWriteOptions {
  actorUserId: string | null;
  entityType: string;
  entityId: string | null;
  action: AuditAction;
  diff?: any;
}
