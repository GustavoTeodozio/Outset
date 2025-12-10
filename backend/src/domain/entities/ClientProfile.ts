export interface ClientProfile {
  id: string;
  tenantId: string;
  businessName: string;
  segment?: string | null;
  website?: string | null;
  mainContact: string;
  mainEmail: string;
  mainPhone?: string | null;
  goals?: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

