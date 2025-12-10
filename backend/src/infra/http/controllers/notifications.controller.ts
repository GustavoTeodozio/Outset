import type { Request, Response } from 'express';
import { z } from 'zod';

import notificationsService from '../../../application/modules/notifications/notifications.service';
import AppError from '../../../shared/errors/AppError';

export const listNotifications = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const items = await notificationsService.list(tenantId);
  return res.json(items);
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) throw new AppError('Tenant não encontrado', 400);

  const params = z.object({ notificationId: z.string().uuid() }).parse(req.params);
  const result = await notificationsService.markAsRead(params.notificationId, tenantId);
  return res.json(result);
};

