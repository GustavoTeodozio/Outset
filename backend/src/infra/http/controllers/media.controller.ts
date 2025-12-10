import type { Request, Response } from 'express';
import { z } from 'zod';

import mediaService from '../../../application/modules/media/media.service';
import AppError from '../../../shared/errors/AppError';
import storageProvider from '../../storage/local-storage.provider';

const listSchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  category: z.string().optional(),
  campaignId: z.string().optional(),
  type: z.string().optional(),
});

const uploadSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  category: z.string().optional(),
  campaignId: z.string().optional(),
  type: z.string().default('IMAGE'),
});

export const listMedia = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  console.log('[MediaController] listMedia - tenantId:', tenantId);
  const filters = listSchema.parse(req.query);
  console.log('[MediaController] listMedia - filters:', filters);
  
  const result = await mediaService.listMedia(tenantId, filters);
  console.log('[MediaController] listMedia - result:', {
    total: result.total,
    itemsCount: result.items.length,
    items: result.items.map((item: any) => ({ id: item.id, title: item.title, tenantId: item.tenantId })),
  });
  
  return res.json(result);
};

export const uploadMedia = async (req: Request, res: Response) => {
  let tenantId = req.auth?.tenantId;
  
  console.log('[MediaController] uploadMedia - req.auth:', {
    role: req.auth?.role,
    tenantId: req.auth?.tenantId,
  });
  console.log('[MediaController] uploadMedia - req.body:', req.body);
  
  // Para admin, pode especificar tenantId no body (FormData) para enviar conteúdo para um cliente específico
  if (req.auth?.role === 'ADMIN' && (req.body as any).tenantId) {
    tenantId = (req.body as any).tenantId;
    console.log('[MediaController] uploadMedia - Usando tenantId do FormData:', tenantId);
  }
  
  if (!tenantId) {
    throw new AppError('Tenant não encontrado', 400);
  }

  const file = req.file;
  if (!file) {
    throw new AppError('Arquivo obrigatório', 400);
  }

  const body = uploadSchema.parse(req.body);
  const stored = await storageProvider.save(file);

  console.log('[MediaController] uploadMedia - Criando mídia com tenantId:', tenantId);

  const media = await mediaService.registerMedia({
    tenantId: tenantId!,
    title: body.title,
    description: body.description,
    category: body.category,
    campaignId: body.campaignId,
    type: body.type,
    fileUrl: stored.fileUrl,
    storageKey: stored.storageKey,
    fileSize: file.size,
    mimeType: file.mimetype,
    uploadedById: req.auth?.userId,
  });

  console.log('[MediaController] uploadMedia - Mídia criada:', { id: media.id, tenantId: media.tenantId });

  return res.status(201).json(media);
};

export const createDownloadToken = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const { mediaId } = z.object({ mediaId: z.string().uuid() }).parse(req.params);
  const token = await mediaService.createDownloadToken(tenantId, mediaId);

  return res.status(201).json(token);
};

export const listAllMedia = async (req: Request, res: Response) => {
  const filters = listSchema.parse(req.query);
  const result = await mediaService.listAllMedia(filters);
  return res.json(result);
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { mediaId } = z.object({ mediaId: z.string().uuid() }).parse(req.params);
    
    console.log('[MediaController] deleteMedia - Deletando mídia:', mediaId);
    
    await mediaService.deleteMedia(mediaId);
    
    console.log('[MediaController] deleteMedia - Mídia deletada com sucesso');
    
    return res.json({ message: 'Mídia excluída com sucesso' });
  } catch (error: any) {
    console.error('[MediaController] deleteMedia - Erro:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Erro ao excluir mídia', 500);
  }
};

export const approveMedia = async (req: Request, res: Response) => {
  const { mediaId } = z.object({ mediaId: z.string().uuid() }).parse(req.params);
  const userId = req.auth?.userId;
  const tenantId = req.auth?.tenantId;

  if (!userId) {
    throw new AppError('Usuário não autenticado', 401);
  }

  const media = await mediaService.approveMedia(mediaId, userId, tenantId);
  
  return res.json(media);
};

const rejectSchema = z.object({
  rejectionNote: z.string().optional(),
});

export const rejectMedia = async (req: Request, res: Response) => {
  const { mediaId } = z.object({ mediaId: z.string().uuid() }).parse(req.params);
  const userId = req.auth?.userId;
  const tenantId = req.auth?.tenantId;
  const { rejectionNote } = rejectSchema.parse(req.body);

  if (!userId) {
    throw new AppError('Usuário não autenticado', 401);
  }

  const media = await mediaService.rejectMedia(mediaId, userId, rejectionNote, tenantId);
  
  return res.json(media);
};

export const listPendingApprovals = async (req: Request, res: Response) => {
  const filters = listSchema.parse(req.query);
  const result = await mediaService.listPendingApprovals(filters);
  return res.json(result);
};

export const listApprovedMedia = async (req: Request, res: Response) => {
  const filters = listSchema.parse(req.query);
  const result = await mediaService.listApprovedMedia(filters);
  return res.json(result);
};

export const listRejectedMedia = async (req: Request, res: Response) => {
  const filters = listSchema.parse(req.query);
  const result = await mediaService.listRejectedMedia(filters);
  return res.json(result);
};

