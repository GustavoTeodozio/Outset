export interface TrainingTrack {
  id: string;
  tenantId: string;
  title: string;
  description?: string | null;
  level?: string | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingModule {
  id: string;
  trackId: string;
  title: string;
  summary?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string | null;
  type: string;
  videoUrl?: string | null;
  resourceUrl?: string | null;
  duration?: number | null;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

