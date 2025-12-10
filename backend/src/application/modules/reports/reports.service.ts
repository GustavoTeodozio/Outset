import type { Prisma } from '@prisma/client';

import prisma from '../../../config/prisma';
import AppError from '../../../shared/errors/AppError';
import { buildPagination, type PaginationParams } from '../../../shared/utils/pagination';

export interface CreateReportInput {
  tenantId: string;
  periodStart: Date;
  periodEnd: Date;
  format: string;
  fileUrl: string;
  storageKey: string;
  metadata?: Prisma.InputJsonValue;
  generatedById?: string;
}

export class ReportsService {
  async list(tenantId: string, params: PaginationParams) {
    const { take, skip } = buildPagination(params);

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where: { tenantId },
        orderBy: { periodStart: 'desc' },
        take,
        skip,
      }),
      prisma.report.count({ where: { tenantId } }),
    ]);

    return { data, total, page: params.page ?? 1, perPage: take };
  }

  async create(input: CreateReportInput) {
    if (input.periodEnd <= input.periodStart) {
      throw new AppError('Período inválido');
    }

    return prisma.report.create({
      data: {
        tenantId: input.tenantId,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        format: input.format as any,
        fileUrl: input.fileUrl,
        storageKey: input.storageKey,
        metadata: input.metadata,
        generatedById: input.generatedById,
      },
    });
  }

  async get(tenantId: string, reportId: string) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });

    if (!report || report.tenantId !== tenantId) {
      throw new AppError('Relatório não encontrado', 404);
    }

    return report;
  }
}

export default new ReportsService();

