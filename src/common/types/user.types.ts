export type JwtUser = {
  sub: string;
  email?: string;
  orgId?: string;
  permissions?: string[];
  [k: string]: any;
};
