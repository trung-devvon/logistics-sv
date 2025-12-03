export enum AuditAction {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
}
export type AuditMeta = { entity: string; action: AuditAction };
