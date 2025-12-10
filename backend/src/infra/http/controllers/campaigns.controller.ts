import type { Request, Response } from 'express';
import { z } from 'zod';

import campaignsService from '../../../application/modules/campaigns/campaigns.service';
import AppError from '../../../shared/errors/AppError';

const createSchema = z.object({
  name: z.string().min(3),
  objective: z.string().optional(),
  budgetStrategy: z.enum(['DAILY', 'LIFETIME']).optional(),
  dailyBudget: z.number().optional(),
  lifetimeBudget: z.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const listCampaigns = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const campaigns = await campaignsService.list(tenantId);
  return res.json(campaigns);
};

export const listAllCampaigns = async (req: Request, res: Response) => {
  const campaigns = await campaignsService.listAll();
  return res.json(campaigns);
};

export const createCampaign = async (req: Request, res: Response) => {
  let tenantId = req.auth?.tenantId;
  const userId = req.auth?.userId;
  
  // Para admin, pode especificar tenantId no body
  if (!tenantId && req.auth?.role === 'ADMIN') {
    tenantId = (req.body as any).tenantId;
    if (!tenantId) throw new AppError('TenantId é obrigatório', 400);
  } else if (!tenantId || !userId) {
    throw new AppError('Contexto incompleto', 400);
  }

  const body = createSchema.parse(req.body);
  const campaign = await campaignsService.create({
    ...body,
    tenantId: tenantId!,
    createdById: userId,
  });

  return res.status(201).json(campaign);
};

export const updateCampaignStatus = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const params = z.object({ campaignId: z.string().uuid() }).parse(req.params);
  const body = z.object({ status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']) }).parse(
    req.body,
  );

  const campaign = await campaignsService.updateStatus(tenantId, params.campaignId, body.status);
  return res.json(campaign);
};

export const requestApproval = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const params = z.object({ campaignId: z.string().uuid() }).parse(req.params);
  const body = z.object({ comment: z.string().optional() }).parse(req.body);

  const approval = await campaignsService.requestApproval(tenantId, params.campaignId, body.comment);
  return res.status(201).json(approval);
};

export const decideApproval = async (req: Request, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) throw new AppError('Contexto incompleto', 400);

  const params = z.object({ approvalId: z.string().uuid() }).parse(req.params);
  const body = z.object({ status: z.enum(['APPROVED', 'REJECTED']) }).parse(req.body);
  const approval = await campaignsService.decideApproval(params.approvalId, body.status, userId);

  return res.json(approval);
};

