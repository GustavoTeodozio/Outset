import { randomBytes } from 'crypto';

import prisma from '../../../config/prisma';
import redis from '../../../config/redis';
import AppError from '../../../shared/errors/AppError';
import { buildPagination, type PaginationParams } from '../../../shared/utils/pagination';
import storageProvider from '../../../infra/storage/local-storage.provider';

export interface ListMediaParams extends PaginationParams {
  category?: string;
  campaignId?: string;
  type?: string;
}

export interface CreateMediaInput {
  tenantId: string;
  title: string;
  description?: string;
  type: string;
  category?: string;
  campaignId?: string;
  fileUrl: string;
  storageKey: string;
  fileSize?: number;
  mimeType?: string;
  uploadedById?: string;
}

export class MediaService {
  async listMedia(tenantId: string, params: ListMediaParams) {
    const { take, skip } = buildPagination(params);

    const [data, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where: {
          tenantId,
          category: params.category,
          campaignId: params.campaignId,
          type: params.type as any,
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.mediaAsset.count({
        where: {
          tenantId,
          category: params.category,
          campaignId: params.campaignId,
          type: params.type as any,
        },
      }),
    ]);

    return {
      items: data,
      total,
      page: params.page ?? 1,
      perPage: take,
    };
  }

  async listAllMedia(params: ListMediaParams) {
    const { take, skip } = buildPagination(params);

    const where: any = {};
    if (params.category) where.category = params.category;
    if (params.campaignId) where.campaignId = params.campaignId;
    if (params.type) where.type = params.type as any;

    const [data, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        include: {
          tenant: {
            include: {
              clients: {
                select: {
                  businessName: true,
                  id: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return {
      items: data,
      total,
      page: params.page ?? 1,
      perPage: take,
    };
  }

  async registerMedia(input: CreateMediaInput) {
    return prisma.mediaAsset.create({
      data: {
        tenantId: input.tenantId,
        title: input.title,
        description: input.description,
        type: input.type as any,
        category: input.category,
        campaignId: input.campaignId,
        fileUrl: input.fileUrl,
        storageKey: input.storageKey,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        uploadedById: input.uploadedById,
      },
    });
  }

  async createDownloadToken(tenantId: string, mediaId: string) {
    const media = await prisma.mediaAsset.findUnique({
      where: { id: mediaId },
    });

    if (!media || media.tenantId !== tenantId) {
      throw new AppError('Mídia não encontrada', 404);
    }

    const token = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    const downloadToken = await prisma.downloadToken.create({
      data: {
        tenantId,
        mediaAssetId: media.id,
        token,
        expiresAt,
      },
    });

    await redis.setex(`media:token:${token}`, 60 * 30, JSON.stringify(downloadToken));

    return downloadToken;
  }

  async validateDownloadToken(token: string) {
    const cached = await redis.get(`media:token:${token}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const downloadToken = await prisma.downloadToken.findFirst({
      where: { token },
      include: { mediaAsset: true },
    });

    if (!downloadToken || downloadToken.expiresAt < new Date()) {
      throw new AppError('Token inválido ou expirado', 401);
    }

    return downloadToken;
  }

  async deleteMedia(mediaId: string) {
    const media = await prisma.mediaAsset.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new AppError('Mídia não encontrada', 404);
    }

    // Deletar o arquivo físico do storage
    try {
      await storageProvider.delete(media.storageKey);
    } catch (error) {
      console.error('Erro ao deletar arquivo físico:', error);
      // Continua mesmo se não conseguir deletar o arquivo físico
    }

    // Deletar tokens de download relacionados
    await prisma.downloadToken.deleteMany({
      where: { mediaAssetId: mediaId },
    });

    // Deletar logs de download relacionados
    await prisma.mediaDownloadLog.deleteMany({
      where: { mediaAssetId: mediaId },
    });

    // Deletar a mídia do banco de dados
    return prisma.mediaAsset.delete({
      where: { id: mediaId },
    });
  }

  async approveMedia(mediaId: string, userId: string, tenantId?: string) {
    const media = await prisma.mediaAsset.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new AppError('Mídia não encontrada', 404);
    }

    // Se tenantId for fornecido, verifica se a mídia pertence ao tenant
    if (tenantId && media.tenantId !== tenantId) {
      throw new AppError('Você não tem permissão para aprovar esta mídia', 403);
    }

    return prisma.mediaAsset.update({
      where: { id: mediaId },
      data: {
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        approvedById: userId,
        rejectionNote: null,
      },
    });
  }

  async rejectMedia(mediaId: string, userId: string, rejectionNote?: string, tenantId?: string) {
    const media = await prisma.mediaAsset.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      throw new AppError('Mídia não encontrada', 404);
    }

    // Se tenantId for fornecido, verifica se a mídia pertence ao tenant
    if (tenantId && media.tenantId !== tenantId) {
      throw new AppError('Você não tem permissão para recusar esta mídia', 403);
    }

    return prisma.mediaAsset.update({
      where: { id: mediaId },
      data: {
        approvalStatus: 'REJECTED',
        approvedAt: new Date(),
        approvedById: userId,
        rejectionNote,
      },
    });
  }

  async listPendingApprovals(params: ListMediaParams) {
    const { take, skip } = buildPagination(params);

    const where: any = {
      approvalStatus: 'PENDING',
    };

    if (params.category) where.category = params.category;
    if (params.campaignId) where.campaignId = params.campaignId;
    if (params.type) where.type = params.type as any;

    const [data, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        include: {
          tenant: {
            include: {
              clients: {
                select: {
                  businessName: true,
                  id: true,
                },
              },
            },
          },
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return {
      items: data,
      total,
      page: params.page ?? 1,
      perPage: take,
    };
  }

  async listApprovedMedia(params: ListMediaParams) {
    const { take, skip } = buildPagination(params);

    const where: any = {
      approvalStatus: 'APPROVED',
    };

    if (params.category) where.category = params.category;
    if (params.campaignId) where.campaignId = params.campaignId;
    if (params.type) where.type = params.type as any;

    const [data, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        include: {
          tenant: {
            include: {
              clients: {
                select: {
                  businessName: true,
                  id: true,
                },
              },
            },
          },
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { approvedAt: 'desc' },
        take,
        skip,
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return {
      items: data,
      total,
      page: params.page ?? 1,
      perPage: take,
    };
  }

  async listRejectedMedia(params: ListMediaParams) {
    const { take, skip } = buildPagination(params);

    const where: any = {
      approvalStatus: 'REJECTED',
    };

    if (params.category) where.category = params.category;
    if (params.campaignId) where.campaignId = params.campaignId;
    if (params.type) where.type = params.type as any;

    const [data, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        include: {
          tenant: {
            include: {
              clients: {
                select: {
                  businessName: true,
                  id: true,
                },
              },
            },
          },
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { approvedAt: 'desc' },
        take,
        skip,
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return {
      items: data,
      total,
      page: params.page ?? 1,
      perPage: take,
    };
  }
}

export default new MediaService();

