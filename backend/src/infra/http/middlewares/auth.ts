import type { NextFunction, Request, Response } from 'express';

import AppError from '../../../shared/errors/AppError';
import { verifyAccessToken } from '../../../shared/utils/token';
import type { UserRole } from '../../../shared/types/roles';

export const ensureAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Não autorizado', 401);
    }

    const token = header.replace('Bearer ', '');
    const payload = verifyAccessToken(token);

    req.auth = {
      userId: payload.userId,
      role: payload.role,
      tenantId: payload.tenantId,
    };

    return next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Erro de autenticação', 401));
  }
};

export const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      throw new AppError('Acesso negado', 403);
    }

    return next();
  };

