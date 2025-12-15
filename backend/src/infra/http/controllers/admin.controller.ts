import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';
import authService from '../../../application/modules/auth/auth.service';

const createAdminSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const getAdminStats = async (req: Request, res: Response) => {
  // Buscar todos os tenants ativos e filtrar apenas os que têm ClientProfile
  const activeTenants = await prisma.tenant.findMany({
    where: { isActive: true },
    include: {
      clients: true,
    },
  });

  // Filtrar apenas tenants que têm ClientProfile (exclui o tenant do admin)
  const activeClients = activeTenants.filter((tenant) => tenant.clients !== null).length;

  const [totalCampaigns, totalMedia] = await Promise.all([
    prisma.campaign.count(),
    prisma.mediaAsset.count(),
  ]);

  return res.json({
    activeClients,
    totalCampaigns,
    totalMedia,
  });
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const body = createAdminSchema.parse(req.body);
    const admin = await authService.createAdmin(body);
    return res.status(201).json(admin);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Dados inválidos', errors: error.issues });
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error('Erro ao criar administrador:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

