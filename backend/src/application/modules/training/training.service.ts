import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';

export interface ProgressInput {
  lessonId: string;
  userId: string;
  tenantId: string;
  progress: number;
}

export interface CreateTrackInput {
  tenantId: string;
  title: string;
  description?: string;
  level?: string;
  coverImageUrl?: string;
  introVideoUrl?: string;
  introVideoFileUrl?: string;
  order?: number;
  isPublished?: boolean;
}

export interface UpdateTrackInput {
  title?: string;
  description?: string;
  level?: string;
  coverImageUrl?: string;
  introVideoUrl?: string;
  introVideoFileUrl?: string;
  order?: number;
  isPublished?: boolean;
}

export interface CreateModuleInput {
  trackId: string;
  title: string;
  summary?: string;
  order?: number;
}

export interface UpdateModuleInput {
  title?: string;
  summary?: string;
  order?: number;
}

import { LessonType } from '@prisma/client';

export interface CreateLessonInput {
  moduleId: string;
  title: string;
  description?: string;
  type: LessonType;
  videoUrl?: string;
  videoFileUrl?: string;
  thumbnailUrl?: string;
  resourceUrl?: string;
  duration?: number;
  order?: number;
  isPublished?: boolean;
}

export interface UpdateLessonInput {
  title?: string;
  description?: string;
  type?: LessonType;
  videoUrl?: string;
  videoFileUrl?: string;
  thumbnailUrl?: string;
  resourceUrl?: string;
  duration?: number;
  order?: number;
  isPublished?: boolean;
}

export class TrainingService {
  // Helper para buscar o tenant do admin (sem ClientProfile)
  async getAdminTenantId(): Promise<string> {
    // Primeiro tenta encontrar pelo nome "Sistema" (tenant padrão do admin)
    let adminTenant = await prisma.tenant.findFirst({
      where: {
        name: 'Sistema',
        clients: null,
      },
      select: { id: true },
    });

    // Se não encontrar, busca qualquer tenant sem ClientProfile
    if (!adminTenant) {
      adminTenant = await prisma.tenant.findFirst({
        where: {
          clients: null,
        },
        select: { id: true },
      });
    }

    if (!adminTenant) {
      // Última tentativa: buscar tenant que tenha usuário ADMIN e não tenha ClientProfile
      const adminUser = await prisma.user.findFirst({
        where: {
          role: 'ADMIN',
        },
        select: { tenantId: true },
      });

      if (adminUser?.tenantId) {
        const tenant = await prisma.tenant.findUnique({
          where: { id: adminUser.tenantId },
          include: { clients: true },
        });

        if (tenant && !tenant.clients) {
          return tenant.id;
        }
      }

      throw new AppError('Tenant do administrador não encontrado', 500);
    }

    return adminTenant.id;
  }

  // Client methods - busca treinamentos globais (do admin) e do próprio cliente
  async listTracks(clientTenantId: string) {
    const adminTenantId = await this.getAdminTenantId();
    
    console.log('[TrainingService] Buscando treinamentos para cliente:', {
      clientTenantId,
      adminTenantId,
    });
    
    const tracks = await prisma.trainingTrack.findMany({
      where: {
        tenantId: adminTenantId, // Apenas treinamentos globais do admin
        isPublished: true,
      },
      orderBy: { order: 'asc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    
    console.log('[TrainingService] Treinamentos encontrados:', tracks.length);
    
    // Log detalhado das lessons para debug
    tracks.forEach(track => {
      track.modules.forEach(module => {
        module.lessons.forEach(lesson => {
          console.log('[TrainingService] Lesson:', {
            id: lesson.id,
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            videoFileUrl: lesson.videoFileUrl,
            thumbnailUrl: lesson.thumbnailUrl,
          });
        });
      });
    });
    
    return tracks;
  }

  async registerProgress(input: ProgressInput) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: input.lessonId },
      include: { module: { include: { track: true } } },
    });

    if (!lesson || lesson.module.track.tenantId !== input.tenantId) {
      throw new AppError('Aula não encontrada', 404);
    }

    return prisma.lessonProgress.upsert({
      where: {
        lessonId_userId: {
          lessonId: input.lessonId,
          userId: input.userId,
        },
      },
      update: {
        progress: input.progress,
        completedAt: input.progress >= 100 ? new Date() : undefined,
      },
      create: {
        lessonId: input.lessonId,
        userId: input.userId,
        tenantId: input.tenantId,
        progress: input.progress,
        completedAt: input.progress >= 100 ? new Date() : undefined,
      },
    });
  }

  // Admin methods - Tracks
  async listAllTracks() {
    const adminTenantId = await this.getAdminTenantId();
    
    console.log('[TrainingService] listAllTracks - adminTenantId:', adminTenantId);
    
    const tracks = await prisma.trainingTrack.findMany({
      where: { tenantId: adminTenantId }, // Apenas treinamentos globais
      orderBy: { order: 'asc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    
    console.log('[TrainingService] listAllTracks - encontradas', tracks.length, 'trilhas');
    console.log('[TrainingService] listAllTracks - isPublished:', tracks.map(t => ({ id: t.id, title: t.title, isPublished: t.isPublished })));
    
    return tracks;
  }

  async createTrack(input: Omit<CreateTrackInput, 'tenantId'>) {
    const adminTenantId = await this.getAdminTenantId();
    
    console.log('[TrainingService] createTrack - adminTenantId:', adminTenantId);
    console.log('[TrainingService] createTrack - input:', { title: input.title, level: input.level, isPublished: input.isPublished });
    
    const maxOrder = await prisma.trainingTrack.findFirst({
      where: { tenantId: adminTenantId },
      orderBy: { order: 'desc' },
    });

    const track = await prisma.trainingTrack.create({
      data: {
        tenantId: adminTenantId, // Sempre usa o tenant do admin para treinamentos globais
        title: input.title,
        description: input.description,
        level: input.level || null, // Garantir que undefined seja convertido para null
        coverImageUrl: input.coverImageUrl,
        introVideoUrl: input.introVideoUrl,
        introVideoFileUrl: input.introVideoFileUrl,
        order: input.order ?? (maxOrder ? maxOrder.order + 1 : 0),
        isPublished: input.isPublished ?? true,
      },
    });
    
    console.log('[TrainingService] createTrack - criada:', { 
      id: track.id, 
      title: track.title, 
      level: track.level,
      isPublished: track.isPublished, 
      tenantId: track.tenantId,
      coverImageUrl: track.coverImageUrl 
    });
    
    return track;
  }

  async updateTrack(trackId: string, input: UpdateTrackInput) {
    const adminTenantId = await this.getAdminTenantId();
    const track = await prisma.trainingTrack.findUnique({
      where: { id: trackId },
    });

    if (!track || track.tenantId !== adminTenantId) {
      throw new AppError('Trilha não encontrada', 404);
    }

    return prisma.trainingTrack.update({
      where: { id: trackId },
      data: input,
    });
  }

  async deleteTrack(trackId: string) {
    const adminTenantId = await this.getAdminTenantId();
    const track = await prisma.trainingTrack.findUnique({
      where: { id: trackId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!track || track.tenantId !== adminTenantId) {
      throw new AppError('Trilha não encontrada', 404);
    }

    // Delete in order: lessonProgress -> lessons -> modules -> track
    const lessonIds = track.modules.flatMap((m) => m.lessons.map((l) => l.id));
    
    // 1. Deletar progressos das aulas
    if (lessonIds.length > 0) {
      await prisma.lessonProgress.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });
    }

    // 2. Deletar todas as aulas
    if (lessonIds.length > 0) {
      await prisma.lesson.deleteMany({
        where: { id: { in: lessonIds } },
      });
    }

    // 3. Deletar todos os módulos
    const moduleIds = track.modules.map((m) => m.id);
    if (moduleIds.length > 0) {
      await prisma.trainingModule.deleteMany({
        where: { id: { in: moduleIds } },
      });
    }

    // 4. Deletar a trilha
    return prisma.trainingTrack.delete({
      where: { id: trackId },
    });
  }

  // Admin methods - Modules
  async createModule(input: CreateModuleInput) {
    const track = await prisma.trainingTrack.findUnique({
      where: { id: input.trackId },
    });

    if (!track) {
      throw new AppError('Trilha não encontrada', 404);
    }

    const maxOrder = await prisma.trainingModule.findFirst({
      where: { trackId: input.trackId },
      orderBy: { order: 'desc' },
    });

    return prisma.trainingModule.create({
      data: {
        trackId: input.trackId,
        title: input.title,
        summary: input.summary,
        order: input.order ?? (maxOrder ? maxOrder.order + 1 : 0),
      },
    });
  }

  async updateModule(moduleId: string, input: UpdateModuleInput) {
    const module = await prisma.trainingModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new AppError('Módulo não encontrado', 404);
    }

    return prisma.trainingModule.update({
      where: { id: moduleId },
      data: input,
    });
  }

  async deleteModule(moduleId: string) {
    const module = await prisma.trainingModule.findUnique({
      where: { id: moduleId },
      include: { lessons: true },
    });

    if (!module) {
      throw new AppError('Módulo não encontrado', 404);
    }

    // Delete lessonProgress first
    const lessonIds = module.lessons.map((l) => l.id);
    if (lessonIds.length > 0) {
      await prisma.lessonProgress.deleteMany({
        where: { lessonId: { in: lessonIds } },
      });
    }

    return prisma.trainingModule.delete({
      where: { id: moduleId },
    });
  }

  // Admin methods - Lessons
  async createLesson(input: CreateLessonInput) {
    const module = await prisma.trainingModule.findUnique({
      where: { id: input.moduleId },
    });

    if (!module) {
      throw new AppError('Módulo não encontrado', 404);
    }

    const maxOrder = await prisma.lesson.findFirst({
      where: { moduleId: input.moduleId },
      orderBy: { order: 'desc' },
    });

    // Gerar thumbnail automático se for URL do YouTube/Vimeo e não tiver thumbnail
    let thumbnailUrl = input.thumbnailUrl;
    if (!thumbnailUrl && input.videoUrl) {
      thumbnailUrl = this.generateVideoThumbnail(input.videoUrl);
    }

    return prisma.lesson.create({
      data: {
        moduleId: input.moduleId,
        title: input.title,
        description: input.description,
        type: input.type,
        videoUrl: input.videoUrl,
        videoFileUrl: input.videoFileUrl,
        thumbnailUrl: thumbnailUrl,
        resourceUrl: input.resourceUrl,
        duration: input.duration,
        order: input.order ?? (maxOrder ? maxOrder.order + 1 : 0),
        isPublished: input.isPublished ?? true,
      },
    });
  }

  // Gerar thumbnail automático de URLs do YouTube/Vimeo
  private generateVideoThumbnail(videoUrl: string): string | undefined {
    try {
      // YouTube
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = videoUrl.match(youtubeRegex);
      if (youtubeMatch) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
      }

      // Vimeo
      const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
      const vimeoMatch = videoUrl.match(vimeoRegex);
      if (vimeoMatch) {
        // Vimeo requer API, mas podemos usar uma URL genérica
        return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
      }
    } catch (error) {
      // Se falhar, retorna undefined para não quebrar
    }
    return undefined;
  }

  async updateLesson(lessonId: string, input: UpdateLessonInput) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new AppError('Aula não encontrada', 404);
    }

    // Gerar thumbnail automático se for URL do YouTube/Vimeo e não tiver thumbnail
    let thumbnailUrl = input.thumbnailUrl;
    if (!thumbnailUrl && input.videoUrl && !lesson.thumbnailUrl) {
      thumbnailUrl = this.generateVideoThumbnail(input.videoUrl);
    }

    // Preparar dados para atualização, convertendo type se necessário
    const updateData: any = {
      ...input,
      thumbnailUrl: thumbnailUrl ?? input.thumbnailUrl,
    };
    
    // Se type for string, converter para LessonType
    if (input.type && typeof input.type === 'string') {
      updateData.type = input.type as LessonType;
    }

    return prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });
  }

  async deleteLesson(lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new AppError('Aula não encontrada', 404);
    }

    // Delete lessonProgress first
    await prisma.lessonProgress.deleteMany({
      where: { lessonId },
    });

    return prisma.lesson.delete({
      where: { id: lessonId },
    });
  }
}

export default new TrainingService();

