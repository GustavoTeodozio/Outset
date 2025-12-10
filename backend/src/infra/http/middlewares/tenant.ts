import type { NextFunction, Request, Response } from 'express';

import AppError from '../../../shared/errors/AppError';
import prisma from '../../../config/prisma';

export const ensureTenant = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.auth?.tenantId) {
      throw new AppError('Tenant não definido', 400);
    }

    // Verificar se o tenant está ativo (apenas para clientes, não para admin)
    if (req.auth.role === 'CLIENT') {
      const tenant = await prisma.tenant.findUnique({
        where: { id: req.auth.tenantId },
        select: { isActive: true },
      });

      if (!tenant || !tenant.isActive) {
        throw new AppError('Acesso bloqueado. Entre em contato com o administrador.', 403);
      }
    }

    return next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return next(error);
    }
    console.error('Erro no ensureTenant:', error);
    return next(new AppError('Erro ao verificar tenant', 500));
  }
};

export default ensureTenant;

