import { SetMetadata } from '@nestjs/common';

// Đây là "key" để chúng ta lưu trữ và truy xuất metadata
export const ROLES_KEY = 'roles';

// Decorator @Roles() sẽ nhận một mảng các 'code' của role
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);