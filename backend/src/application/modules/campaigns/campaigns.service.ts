import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';

export interface CreateCampaignInput {
  tenantId: string;
  name: string;
  objective?: string;
  budgetStrategy?: 'DAILY' | 'LIFETIME';
  dailyBudget?: number;
  lifetimeBudget?: number;
  startDate?: Date;
  endDate?: Date;
  createdById?: string;
}

export class CampaignsService {
  list(tenantId: string) {
    return prisma.campaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        approvals: {
          orderBy: { requestedAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  listAll() {
    return prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        approvals: {
          orderBy: { requestedAt: 'desc' },
          take: 1,
        },
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  create(input: CreateCampaignInput) {
    return prisma.campaign.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        objective: input.objective,
        budgetStrategy: (input.budgetStrategy ?? 'DAILY') as any,
        dailyBudget: input.dailyBudget,
        lifetimeBudget: input.lifetimeBudget,
        startDate: input.startDate,
        endDate: input.endDate,
        createdById: input.createdById,
      },
    });
  }

  async updateStatus(tenantId: string, campaignId: string, status: string) {
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });

    if (!campaign || campaign.tenantId !== tenantId) {
      throw new AppError('Campanha não encontrada', 404);
    }

    return prisma.campaign.update({
      where: { id: campaignId },
      data: { status: status as any },
    });
  }

  async requestApproval(tenantId: string, campaignId: string, comment?: string) {
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });

    if (!campaign || campaign.tenantId !== tenantId) {
      throw new AppError('Campanha não encontrada', 404);
    }

    return prisma.campaignApproval.create({
      data: {
        tenantId,
        campaignId,
        comment,
      },
    });
  }

  async decideApproval(approvalId: string, status: 'APPROVED' | 'REJECTED', decidedById: string) {
    const approval = await prisma.campaignApproval.findUnique({ where: { id: approvalId } });

    if (!approval) {
      throw new AppError('Requisição não encontrada', 404);
    }

    return prisma.campaignApproval.update({
      where: { id: approvalId },
      data: {
        status,
        decidedById,
        decidedAt: new Date(),
      },
    });
  }
}

export default new CampaignsService();

