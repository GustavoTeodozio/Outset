import type { TaskStatus, TaskCategory, TaskPriority } from '@prisma/client';

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  assigneeId?: string | null;
  assigneeName?: string | null;
  createdById?: string | null;
  campaignId?: string | null;
  dueDate?: Date | null;
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  position: number;
  tags?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskComment {
  id: string;
  taskId: string;
  tenantId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskChecklistItem {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  mediaId?: string | null;
  name: string;
  url: string;
  type: string;
  size?: number | null;
  createdAt: Date;
}

export interface TaskMetrics {
  id: string;
  taskId: string;
  budget?: number | null;
  spent?: number | null;
  impressions?: number | null;
  clicks?: number | null;
  cpm?: number | null;
  cpc?: number | null;
  ctr?: number | null;
  conversions?: number | null;
  conversionRate?: number | null;
  leadGoal?: number | null;
  salesGoal?: number | null;
  leadsActual?: number | null;
  salesActual?: number | null;
  revenue?: number | null;
  roas?: number | null;
  lastSyncAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

