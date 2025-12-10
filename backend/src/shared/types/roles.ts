export type UserRole = 'ADMIN' | 'CLIENT';

export interface AuthContext {
  userId: string;
  tenantId?: string;
  role: UserRole;
}

