import type { Request, Response } from 'express';

import dashboardService from '../../../application/modules/dashboard/dashboard.service';
import AppError from '../../../shared/errors/AppError';

export const getSummary = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;

  if (!tenantId) {
    throw new AppError('Tenant não encontrado', 400);
  }

  const summary = await dashboardService.getClientSummary(tenantId);
  return res.json(summary);
};

