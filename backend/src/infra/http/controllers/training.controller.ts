import type { Request, Response } from 'express';
import { z } from 'zod';

import trainingService from '../../../application/modules/training/training.service';
import AppError from '../../../shared/errors/AppError';

const progressSchema = z.object({
  lessonId: z.string().uuid(),
  progress: z.number().min(0).max(100),
});

export const listTrainingTracks = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  console.log('[TrainingController] Listando treinamentos para tenant:', tenantId);
  
  const tracks = await trainingService.listTracks(tenantId);
  
  console.log('[TrainingController] Retornando', tracks.length, 'treinamentos');
  
  return res.json(tracks);
};

export const saveProgress = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  const userId = req.auth?.userId;
  if (!tenantId || !userId) throw new AppError('Contexto incompleto', 400);

  const body = progressSchema.parse(req.body);
  const progress = await trainingService.registerProgress({
    lessonId: body.lessonId,
    progress: body.progress,
    tenantId,
    userId,
  });

  return res.json(progress);
};

