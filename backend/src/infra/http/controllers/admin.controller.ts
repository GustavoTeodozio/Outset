import type { Request, Response } from 'express';
import prisma from '../../../config/prisma';

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

