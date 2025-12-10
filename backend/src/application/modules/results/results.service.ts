import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';

export interface RegisterResultInput {
  tenantId: string;
  periodMonth: number;
  periodYear: number;
  leads: number;
  sales: number;
  revenue?: number;
  notes?: string;
  userId: string;
}

export class ResultsService {
  async register(input: RegisterResultInput) {
    if (input.periodMonth < 1 || input.periodMonth > 12) {
      throw new AppError('Mês inválido');
    }

    return prisma.manualResult.upsert({
      where: {
        tenantId_periodMonth_periodYear: {
          tenantId: input.tenantId,
          periodMonth: input.periodMonth,
          periodYear: input.periodYear,
        },
      },
      update: {
        leads: input.leads,
        sales: input.sales,
        revenue: input.revenue,
        notes: input.notes,
        createdById: input.userId,
      },
      create: {
        tenantId: input.tenantId,
        periodMonth: input.periodMonth,
        periodYear: input.periodYear,
        leads: input.leads,
        sales: input.sales,
        revenue: input.revenue,
        notes: input.notes,
        createdById: input.userId,
      },
    });
  }

  list(tenantId: string) {
    return prisma.manualResult.findMany({
      where: { tenantId },
      orderBy: [
        { periodYear: 'desc' },
        { periodMonth: 'desc' },
      ],
    });
  }
}

export default new ResultsService();

