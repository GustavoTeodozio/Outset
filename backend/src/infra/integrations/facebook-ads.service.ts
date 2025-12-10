import axios from 'axios';
import prisma from '../../config/prisma';
import AppError from '../../shared/errors/AppError';

interface FacebookCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
}

interface FacebookInsights {
  impressions?: string;
  clicks?: string;
  spend?: string;
  cpm?: string;
  cpc?: string;
  ctr?: string;
  actions?: Array<{ action_type: string; value: string }>;
}

export class FacebookAdsService {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  async getCampaigns(accessToken: string, adAccountId?: string) {
    try {
      // Se não tem ad account ID, busca da conta do usuário
      const accountsUrl = adAccountId 
        ? `${this.baseUrl}/${adAccountId}/campaigns`
        : `${this.baseUrl}/me/adaccounts`;

      const response = await axios.get(accountsUrl, {
        params: {
          access_token: accessToken,
          fields: adAccountId ? 'id,name,status,objective' : 'id,name',
        },
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('[FacebookAds] Erro ao buscar campanhas:', error.response?.data || error.message);
      throw new AppError('Erro ao buscar campanhas do Facebook', 500);
    }
  }

  async getCampaignInsights(accessToken: string, campaignId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/${campaignId}/insights`, {
        params: {
          access_token: accessToken,
          fields: 'impressions,clicks,spend,cpm,cpc,ctr,actions',
          time_range: JSON.stringify({ since: '2024-01-01', until: new Date().toISOString().split('T')[0] }),
        },
      });

      const data = response.data.data?.[0] || {};
      
      // Processar ações (conversões)
      const conversions = data.actions?.find((a: any) => 
        a.action_type === 'offsite_conversion.fb_pixel_lead' || 
        a.action_type === 'lead'
      );

      return {
        impressions: parseInt(data.impressions || '0'),
        clicks: parseInt(data.clicks || '0'),
        spend: parseFloat(data.spend || '0'),
        cpm: parseFloat(data.cpm || '0'),
        cpc: parseFloat(data.cpc || '0'),
        ctr: parseFloat(data.ctr || '0'),
        conversions: conversions ? parseInt(conversions.value) : 0,
      };
    } catch (error: any) {
      console.error('[FacebookAds] Erro ao buscar insights:', error.response?.data || error.message);
      throw new AppError('Erro ao buscar métricas da campanha', 500);
    }
  }

  async syncClientCampaigns(tenantId: string) {
    try {
      // Buscar cliente e API key
      const client = await prisma.clientProfile.findUnique({
        where: { tenantId },
      });

      if (!client?.metaApiKey) {
        throw new AppError('Cliente não possui API Key do Facebook configurada', 400);
      }

      // Buscar campanhas do Facebook
      const campaigns = await this.getCampaigns(client.metaApiKey);
      
      // Buscar campanhas existentes no banco
      const existingCampaigns = await prisma.campaign.findMany({
        where: { tenantId },
      });

      const syncedCampaigns = [];

      // Atualizar ou criar campanhas
      for (const fbCampaign of campaigns) {
        const existing = existingCampaigns.find(c => c.adAccountId === fbCampaign.id);

        if (existing) {
          // Atualizar
          const updated = await prisma.campaign.update({
            where: { id: existing.id },
            data: {
              name: fbCampaign.name,
              status: this.mapStatus(fbCampaign.status),
              objective: fbCampaign.objective,
              metaData: fbCampaign,
            },
          });
          syncedCampaigns.push(updated);
        } else {
          // Criar nova
          const created = await prisma.campaign.create({
            data: {
              tenantId,
              name: fbCampaign.name,
              status: this.mapStatus(fbCampaign.status),
              objective: fbCampaign.objective,
              adAccountId: fbCampaign.id,
              metaData: fbCampaign,
            },
          });
          syncedCampaigns.push(created);
        }

        // Buscar e salvar insights
        try {
          const insights = await this.getCampaignInsights(client.metaApiKey, fbCampaign.id);
          
          // Criar ou atualizar resultado manual com os dados
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();

          await prisma.manualResult.upsert({
            where: {
              tenantId_periodMonth_periodYear: {
                tenantId,
                periodMonth: currentMonth,
                periodYear: currentYear,
              },
            },
            create: {
              tenantId,
              periodMonth: currentMonth,
              periodYear: currentYear,
              leads: insights.conversions,
              sales: 0,
              revenue: insights.spend,
              notes: `Sincronizado via Facebook Ads - ${new Date().toLocaleString('pt-BR')}`,
            },
            update: {
              leads: insights.conversions,
              revenue: insights.spend,
              notes: `Sincronizado via Facebook Ads - ${new Date().toLocaleString('pt-BR')}`,
            },
          });
        } catch (error) {
          console.error('[FacebookAds] Erro ao buscar insights da campanha:', fbCampaign.id, error);
        }
      }

      return syncedCampaigns;
    } catch (error: any) {
      console.error('[FacebookAds] Erro ao sincronizar campanhas:', error);
      throw error;
    }
  }

  private mapStatus(fbStatus: string): any {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'ACTIVE',
      'PAUSED': 'PAUSED',
      'DELETED': 'ARCHIVED',
      'ARCHIVED': 'ARCHIVED',
    };
    return statusMap[fbStatus] || 'DRAFT';
  }
}

export default new FacebookAdsService();

