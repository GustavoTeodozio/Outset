import type { Request, Response } from 'express';
import { z } from 'zod';
import facebookAdsService from '../../integrations/facebook-ads.service';
import AppError from '../../../shared/errors/AppError';

export const syncCampaigns = async (req: Request, res: Response) => {
  // Admin pode especificar clientId, cliente usa seu próprio tenantId
  let tenantId = req.auth?.tenantId;
  
  if (req.auth?.role === 'ADMIN' && req.params.clientId) {
    tenantId = req.params.clientId;
  }
  
  if (!tenantId) {
    throw new AppError('Tenant não encontrado', 400);
  }

  console.log('[FacebookAdsController] Sincronizando campanhas para tenant:', tenantId);

  try {
    const campaigns = await facebookAdsService.syncClientCampaigns(tenantId);
    
    return res.json({
      message: 'Campanhas sincronizadas com sucesso',
      total: campaigns.length,
      campaigns,
    });
  } catch (error: any) {
    console.error('[FacebookAdsController] Erro ao sincronizar:', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    return res.status(500).json({
      message: 'Erro ao sincronizar campanhas do Facebook',
      error: error.message,
    });
  }
};

export const getCampaignMetrics = async (req: Request, res: Response) => {
  const tenantId = req.auth?.tenantId;
  const { campaignId } = z.object({ campaignId: z.string() }).parse(req.params);
  
  if (!tenantId) {
    throw new AppError('Tenant não encontrado', 400);
  }

  // Implementar busca de métricas específicas se necessário
  return res.json({ message: 'Em desenvolvimento' });
};

