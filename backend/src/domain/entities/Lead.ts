export interface Lead {
  id: string;
  tenantId: string;
  source: string;
  externalId?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  notes?: string | null;
  receivedAt: Date;
  createdAt: Date;
}

