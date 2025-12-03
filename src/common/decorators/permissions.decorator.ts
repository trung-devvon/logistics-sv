import { SetMetadata } from '@nestjs/common';
export const PERMISSIONS_KEY = 'route:permissions';
export const Permissions = (...perms: string[]) =>
  SetMetadata(PERMISSIONS_KEY, perms);
