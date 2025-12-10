import type { Request, Response } from 'express';
import { z } from 'zod';
import trainingService from '../../../application/modules/training/training.service';
import AppError from '../../../shared/errors/AppError';
import storageProvider from '../../storage/local-storage.provider';

const createTrackSchema = z.object({
  title: z.string().min(3),
  description: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().optional()),
  level: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().optional()),
  coverImageUrl: z.string().url().optional(),
  introVideoUrl: z.string().url().optional(),
  introVideoFileUrl: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});

const updateTrackSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().optional()),
  level: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().optional()),
  coverImageUrl: z.string().url().optional(),
  introVideoUrl: z.string().url().optional(),
  introVideoFileUrl: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});

const createModuleSchema = z.object({
  trackId: z.string().uuid(),
  title: z.string().min(3),
  summary: z.string().optional(),
  order: z.number().optional(),
});

const updateModuleSchema = z.object({
  title: z.string().min(3).optional(),
  summary: z.string().optional(),
  order: z.number().optional(),
});

const createLessonSchema = z.object({
  moduleId: z.string().uuid(),
  title: z.string().min(3),
  description: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().optional()),
  type: z.enum(['VIDEO', 'ARTICLE', 'LINK', 'LIVE']),
  videoUrl: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().url().optional()),
  videoFileUrl: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().optional()),
  thumbnailUrl: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().url().optional()),
  resourceUrl: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.string().url().optional()),
  duration: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.coerce.number().optional()),
  order: z.preprocess((val) => val === '' || val === 'undefined' ? undefined : val, z.coerce.number().optional()),
  isPublished: z.preprocess((val) => {
    if (val === '' || val === 'undefined' || val === 'false') return false;
    if (val === 'true' || val === true) return true;
    return val;
  }, z.coerce.boolean().optional()),
}).refine((data) => {
  // Se o tipo for VIDEO, videoUrl é obrigatório e não pode ser vazio
  if (data.type === 'VIDEO') {
    if (!data.videoUrl || data.videoUrl.trim() === '') {
      return false;
    }
    // Validar se é uma URL válida
    try {
      new URL(data.videoUrl);
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: 'URL do vídeo é obrigatória e deve ser válida quando o tipo é VIDEO',
  path: ['videoUrl'],
});

const updateLessonSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'ARTICLE', 'LINK', 'LIVE']).optional(),
  videoUrl: z.string().url().optional(),
  videoFileUrl: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  resourceUrl: z.string().url().optional(),
  duration: z.number().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
}).refine((data) => {
  // Se o tipo for VIDEO, videoUrl é obrigatório
  if (data.type === 'VIDEO' && !data.videoUrl) {
    return false;
  }
  return true;
}, {
  message: 'URL do vídeo é obrigatória quando o tipo é VIDEO',
  path: ['videoUrl'],
});

// Tracks
export const listAllTracks = async (req: Request, res: Response) => {
  console.log('[AdminTrainingController] Listando todas as trilhas');
  const tracks = await trainingService.listAllTracks();
  console.log('[AdminTrainingController] Encontradas', tracks.length, 'trilhas');
  return res.json(tracks);
};

export const createTrack = async (req: Request, res: Response) => {
  try {
    const coverFile = req.file as Express.Multer.File | undefined;
    
    console.log('[AdminTrainingController] createTrack - coverFile:', coverFile?.filename);
    console.log('[AdminTrainingController] createTrack - body:', req.body);
    
    // Converter string boolean para boolean se necessário
    const rawBody = req.body;
    if (typeof rawBody.isPublished === 'string') {
      rawBody.isPublished = rawBody.isPublished === 'true';
    }
    
    // Tratar strings vazias como undefined
    if (rawBody.level === '' || rawBody.level === 'undefined') {
      rawBody.level = undefined;
    }
    if (rawBody.description === '' || rawBody.description === 'undefined') {
      rawBody.description = undefined;
    }
    
    // Se houver upload de capa, usar o storage provider
    let coverImageUrl = rawBody.coverImageUrl;
    if (coverFile) {
      const stored = await storageProvider.save(coverFile);
      coverImageUrl = stored.fileUrl;
      console.log('[AdminTrainingController] createTrack - coverImageUrl:', coverImageUrl);
    }
    
    // Vídeo agora é apenas URL (YouTube/Vimeo), não mais upload de arquivo
    const body = createTrackSchema.parse({ ...rawBody, coverImageUrl });
    const track = await trainingService.createTrack(body);
    console.log('[AdminTrainingController] createTrack - track criada:', { id: track.id, coverImageUrl: track.coverImageUrl, level: track.level });
    return res.status(201).json(track);
  } catch (error: any) {
    console.error('Erro ao criar trilha:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dados inválidos', errors: error.issues });
    }
    throw error;
  }
};

export const updateTrack = async (req: Request, res: Response) => {
  try {
    const { trackId } = z.object({ trackId: z.string().uuid() }).parse(req.params);
    const coverFile = req.file as Express.Multer.File | undefined;
    
    console.log('[AdminTrainingController] updateTrack - coverFile:', coverFile?.filename);
    
    const rawBody = req.body;
    
    // Tratar strings vazias como undefined
    if (rawBody.level === '' || rawBody.level === 'undefined') {
      rawBody.level = undefined;
    }
    if (rawBody.description === '' || rawBody.description === 'undefined') {
      rawBody.description = undefined;
    }
    
    // Se houver upload de capa, usar o storage provider
    let coverImageUrl = rawBody.coverImageUrl;
    if (coverFile) {
      const stored = await storageProvider.save(coverFile);
      coverImageUrl = stored.fileUrl;
      console.log('[AdminTrainingController] updateTrack - coverImageUrl:', coverImageUrl);
    }
    
    // Vídeo agora é apenas URL (YouTube/Vimeo), não mais upload de arquivo
    const body = updateTrackSchema.parse({ ...rawBody, coverImageUrl });
    const track = await trainingService.updateTrack(trackId, body);
    return res.json(track);
  } catch (error: any) {
    console.error('Erro ao atualizar trilha:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dados inválidos', errors: error.issues });
    }
    throw error;
  }
};

export const deleteTrack = async (req: Request, res: Response) => {
  try {
    const { trackId } = z.object({ trackId: z.string().uuid() }).parse(req.params);
    
    console.log('[AdminTrainingController] deleteTrack - trackId:', trackId);
    
    await trainingService.deleteTrack(trackId);
    
    console.log('[AdminTrainingController] deleteTrack - trilha excluída com sucesso');
    
    return res.json({ message: 'Trilha excluída com sucesso' });
  } catch (error: any) {
    console.error('[AdminTrainingController] Erro ao excluir trilha:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'ID inválido', errors: error.issues });
    }
    throw error;
  }
};

// Modules
export const createModule = async (req: Request, res: Response) => {
  const body = createModuleSchema.parse(req.body);
  const module = await trainingService.createModule(body);
  return res.status(201).json(module);
};

export const updateModule = async (req: Request, res: Response) => {
  const { moduleId } = z.object({ moduleId: z.string().uuid() }).parse(req.params);
  const body = updateModuleSchema.parse(req.body);
  const module = await trainingService.updateModule(moduleId, body);
  return res.json(module);
};

export const deleteModule = async (req: Request, res: Response) => {
  const { moduleId } = z.object({ moduleId: z.string().uuid() }).parse(req.params);
  await trainingService.deleteModule(moduleId);
  return res.json({ message: 'Módulo excluído com sucesso' });
};

// Lessons
export const createLesson = async (req: Request, res: Response) => {
  const thumbnailFile = req.file as Express.Multer.File | undefined;
  
  console.log('[AdminTrainingController] createLesson - body recebido:', req.body);
  console.log('[AdminTrainingController] createLesson - thumbnailFile:', thumbnailFile?.filename);
  
  try {
    // Limpar strings vazias antes de validar
    const cleanedBody: any = { ...req.body };
    Object.keys(cleanedBody).forEach(key => {
      if (cleanedBody[key] === '' || cleanedBody[key] === 'undefined' || cleanedBody[key] === 'null') {
        if (key !== 'videoUrl' || cleanedBody.type !== 'VIDEO') {
          delete cleanedBody[key];
        }
      }
    });
    
    console.log('[AdminTrainingController] createLesson - body limpo:', cleanedBody);
    
    const body = createLessonSchema.parse(cleanedBody);
  
  // Vídeo agora é apenas URL (YouTube/Vimeo), não mais upload de arquivo
  // Se houver upload de thumbnail, usar o storage provider
  let thumbnailUrl = body.thumbnailUrl;
  if (thumbnailFile) {
    const storageProvider = (await import('../../storage/local-storage.provider')).default;
    const stored = await storageProvider.save(thumbnailFile);
    thumbnailUrl = stored.fileUrl;
  }
  
    const lesson = await trainingService.createLesson({
      ...body,
      thumbnailUrl,
    });
    
    return res.status(201).json(lesson);
  } catch (error: any) {
    console.error('[AdminTrainingController] Erro ao criar aula:', error);
    if (error instanceof z.ZodError) {
      console.error('[AdminTrainingController] Erros de validação:', error.issues);
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: error.issues 
      });
    }
    throw error;
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  const { lessonId } = z.object({ lessonId: z.string().uuid() }).parse(req.params);
  const thumbnailFile = req.file as Express.Multer.File | undefined;
  
  const body = updateLessonSchema.parse(req.body);
  
  // Vídeo agora é apenas URL (YouTube/Vimeo), não mais upload de arquivo
  // Se houver upload de thumbnail, usar o storage provider
  let thumbnailUrl = body.thumbnailUrl;
  if (thumbnailFile) {
    const storageProvider = (await import('../../storage/local-storage.provider')).default;
    const stored = await storageProvider.save(thumbnailFile);
    thumbnailUrl = stored.fileUrl;
  }
  
  const lesson = await trainingService.updateLesson(lessonId, {
    ...body,
    thumbnailUrl: thumbnailUrl ?? body.thumbnailUrl,
  });
  
  return res.json(lesson);
};

export const deleteLesson = async (req: Request, res: Response) => {
  const { lessonId } = z.object({ lessonId: z.string().uuid() }).parse(req.params);
  await trainingService.deleteLesson(lessonId);
  return res.json({ message: 'Aula excluída com sucesso' });
};

