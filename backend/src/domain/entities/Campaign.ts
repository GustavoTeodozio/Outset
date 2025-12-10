import type { CampaignStatus } from '@prisma/client';

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  objective?: string | null;
  status: CampaignStatus;
  budgetStrategy: 'DAILY' | 'LIFETIME';
  dailyBudget?: string | null;
  lifetimeBudget?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  adAccountId?: string | null;
  pixelId?: string | null;
  createdById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

