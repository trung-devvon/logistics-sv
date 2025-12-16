export enum AuditAction {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
  Read = 'READ',
}
export type AuditMeta = { entity: string; action: AuditAction };
