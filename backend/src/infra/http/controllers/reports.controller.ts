import type { Request, Response } from 'express';
import { z } from 'zod';

import reportsService from '../../../application/modules/reports/reports.service';
import AppError from '../../../shared/errors/AppError';

const listSchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
});

const createSchema = z.object({
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  format: z.string().default('PDF'),
  fileUrl: z.string().url(),
  storageKey: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const listReports = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const filters = listSchema.parse(req.query);
  const reports = await reportsService.list(tenantId, filters);
  return res.json(reports);
};

export const createReport = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  const userId = req.auth?.userId;
  if (!tenantId || !userId) throw new AppError('Contexto incompleto', 400);

  const body = createSchema.parse(req.body);
  const report = await reportsService.create({
    ...body,
    tenantId,
    generatedById: userId,
  });

  return res.status(201).json(report);
};

export const getReport = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const params = z.object({ reportId: z.string().uuid() }).parse(req.params);
  const report = await reportsService.get(tenantId, params.reportId);
  return res.json(report);
};

