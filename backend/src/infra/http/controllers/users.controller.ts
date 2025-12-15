import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';
import { hashPassword } from '../../../shared/utils/password';

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
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });

  return res.json(users);
};

export const listAdmins = async (req: Request, res: Response) => {
  const admins = await prisma.user.findMany({
    where: {
      role: 'ADMIN',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(admins);
};

const createAdminSchema = z.object({
  name: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
});

export const createAdmin = async (req: Request, res: Response) => {
  const validation = createAdminSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError('Dados inválidos', 400);
  }

  const { name, email, password } = validation.data;

  // Verificar se email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email já está em uso', 400);
  }

  // Buscar ou criar tenant "Sistema"
  let systemTenant = await prisma.tenant.findFirst({
    where: { name: 'Sistema' },
  });

  if (!systemTenant) {
    systemTenant = await prisma.tenant.create({
      data: {
        name: 'Sistema',
        slug: 'sistema',
        isActive: true,
      },
    });
  }

  // Criar admin
  const hashedPassword = await hashPassword(password);
  
  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: systemTenant.id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return res.status(201).json(admin);
};

