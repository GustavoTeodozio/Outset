import type { Request, Response } from 'express';
import prisma from '../../../config/prisma';

export const getAdminStats = async (req: Request, res: Response) => {
  const [allProfiles, totalCampaigns, totalMedia] = await Promise.all([
    prisma.clientProfile.findMany({
      select: {
        clientStatus: true,
        monthlyValue: true,
        activeSince: true,
        deactivatedAt: true,
        createdAt: true,
      },
    }),
    prisma.campaign.count(),
    prisma.mediaAsset.count(),
  ]);

  const activeClients = allProfiles.filter((p) => p.clientStatus === 'ACTIVE').length;
  const pausedClients = allProfiles.filter((p) => p.clientStatus === 'PAUSED').length;
  const cancelledClients = allProfiles.filter((p) => p.clientStatus === 'CANCELLED').length;

  // MRR: soma dos valores mensais de clientes ACTIVE
  const mrr = allProfiles
    .filter((p) => p.clientStatus === 'ACTIVE' && p.monthlyValue)
    .reduce((sum, p) => sum + Number(p.monthlyValue), 0);

  // LT: tempo médio em meses que os clientes ficam/ficaram ativos
  const now = new Date();
  const tenures = allProfiles.map((p) => {
    const start = p.activeSince ?? p.createdAt;
    const end = p.clientStatus !== 'ACTIVE' && p.deactivatedAt ? p.deactivatedAt : now;
    const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    return Math.max(0, months);
  });

  const lt = tenures.length > 0
    ? tenures.reduce((a, b) => a + b, 0) / tenures.length
    : 0;

  return res.json({
    activeClients,
    pausedClients,
    cancelledClients,
    totalClients: allProfiles.length,
    totalCampaigns,
    totalMedia,
    mrr: Math.round(mrr * 100) / 100,
    lt: Math.round(lt * 10) / 10,
  });
};

