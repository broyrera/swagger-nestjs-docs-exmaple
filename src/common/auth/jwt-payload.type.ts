import { GlobalUserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: GlobalUserRole;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: GlobalUserRole;
}
