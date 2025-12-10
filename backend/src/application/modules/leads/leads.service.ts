import prisma from '../../../config/prisma';
import { buildPagination, type PaginationParams } from '../../../shared/utils/pagination';

export interface CreateLeadInput {
  tenantId: string;
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  notes?: string;
}

export class LeadsService {
  async list(tenantId: string, params: PaginationParams) {
    const { take, skip } = buildPagination(params);

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where: { tenantId },
        orderBy: { receivedAt: 'desc' },
        take,
        skip,
      }),
      prisma.lead.count({ where: { tenantId } }),
    ]);

    return { data, total, page: params.page ?? 1, perPage: take };
  }

  create(input: CreateLeadInput) {
    return prisma.lead.create({
      data: {
        tenantId: input.tenantId,
        source: (input.source ?? 'MANUAL') as any,
        name: input.name,
        email: input.email,
        phone: input.phone,
        status: input.status,
        notes: input.notes,
      },
    });
  }
}

export default new LeadsService();

