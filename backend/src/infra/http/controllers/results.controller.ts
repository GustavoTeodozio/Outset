import type { Request, Response } from 'express';
import { z } from 'zod';

import resultsService from '../../../application/modules/results/results.service';
import AppError from '../../../shared/errors/AppError';

const registerSchema = z.object({
  periodMonth: z.number().int().min(1).max(12),
  periodYear: z.number().int().min(2000),
  leads: z.number().int().nonnegative(),
  sales: z.number().int().nonnegative(),
  revenue: z.number().optional(),
  notes: z.string().optional(),
});

export const registerResult = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  const userId = req.auth?.userId;
  if (!tenantId || !userId) throw new AppError('Contexto incompleto', 400);

  const body = registerSchema.parse(req.body);
  const result = await resultsService.register({ ...body, tenantId, userId });
  return res.status(201).json(result);
};

export const listResults = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const results = await resultsService.list(tenantId);
  return res.json(results);
};

