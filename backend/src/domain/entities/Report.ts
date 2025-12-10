export interface Report {
  id: string;
  tenantId: string;
  periodStart: Date;
  periodEnd: Date;
  format: string;
  fileUrl: string;
  storageKey: string;
  metadata?: Record<string, unknown> | null;
  generatedById?: string | null;
  createdAt: Date;
}

