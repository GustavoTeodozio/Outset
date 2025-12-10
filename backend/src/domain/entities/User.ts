import type { UserRole } from '../../shared/types/roles';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  tenantId?: string | null;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

