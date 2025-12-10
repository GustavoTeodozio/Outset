import type { Request, Response } from 'express';
import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';

export const listUsers = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  
  // Admin pode ver todos os usuários, cliente vê apenas do seu tenant
  const where: any = { isActive: true };
  
  if (req.auth?.role === 'CLIENT' && tenantId) {
    where.tenantId = tenantId;
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: 'asc' },
  });

  return res.json(users);
};

