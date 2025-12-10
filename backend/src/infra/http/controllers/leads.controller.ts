import type { Request, Response } from 'express';
import { z } from 'zod';

import leadsService from '../../../application/modules/leads/leads.service';
import AppError from '../../../shared/errors/AppError';

const listSchema = z.object({
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
});

const createSchema = z.object({
  source: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export const listLeads = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const filters = listSchema.parse(req.query);
  const leads = await leadsService.list(tenantId, filters);
  return res.json(leads);
};

export const createLead = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const body = createSchema.parse(req.body);
  const lead = await leadsService.create({ ...body, tenantId });
  return res.status(201).json(lead);
};

