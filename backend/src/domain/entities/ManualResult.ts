export interface ManualResult {
  id: string;
  tenantId: string;
  periodMonth: number;
  periodYear: number;
  leads: number;
  sales: number;
  revenue?: string | null;
  notes?: string | null;
  createdById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

