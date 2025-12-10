import type { MediaType, ApprovalStatus } from '@prisma/client';

export interface MediaAsset {
  id: string;
  tenantId: string;
  title: string;
  description?: string | null;
  type: MediaType;
  category?: string | null;
  campaignId?: string | null;
  fileUrl: string;
  storageKey: string;
  fileSize?: number | null;
  mimeType?: string | null;
  uploadedById?: string | null;
  approvalStatus: ApprovalStatus;
  approvedAt?: Date | null;
  approvedById?: string | null;
  rejectionNote?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

