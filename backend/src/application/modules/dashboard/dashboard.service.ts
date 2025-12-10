import prisma from '../../../config/prisma';
import redis from '../../../config/redis';
import logger from '../../../config/logger';

const DASHBOARD_TTL_SECONDS = 60;

const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;

export class DashboardService {
  async getClientSummary(tenantId: string) {
    const cacheKey = `dash:${tenantId}:${monthKey(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
    )}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const [manualResults, leadsCount, mediaCount, trainingCount, notifications] =
      await Promise.all([
        prisma.manualResult.findMany({
          where: { tenantId },
          orderBy: [
            { periodYear: 'desc' },
            { periodMonth: 'desc' },
          ],
          take: 6,
        }),
        prisma.lead.count({
          where: { tenantId, receivedAt: { gte: this.getMonthStart() } },
        }),
        prisma.mediaAsset.count({
          where: { tenantId, createdAt: { gte: this.getLastDays(30) } },
        }),
        prisma.lesson.count({
          where: { module: { track: { tenantId } }, createdAt: { gte: this.getLastDays(30) } },
        }),
        prisma.notification.findMany({
          where: { tenantId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    const current = manualResults[0];
    const previous = manualResults[1];

    const growthPercent =
      current && previous && previous.sales > 0
        ? ((current.sales - previous.sales) / previous.sales) * 100
        : null;

    const closeRate =
      current && current.leads > 0 ? (current.sales / current.leads) * 100 : null;

    const summary = {
      growthPercent,
      leadsReceived: leadsCount,
      salesClosed: current?.sales ?? 0,
      closeRate,
      revenue: current?.revenue ?? null,
      monthlyEvolution: manualResults
        .map((result) => ({
          period: `${String(result.periodMonth).padStart(2, '0')}/${result.periodYear}`,
          leads: result.leads,
          sales: result.sales,
          revenue: result.revenue,
        }))
        .reverse(),
      adsResults: {
        budget: current?.revenue ?? null,
        roi:
          current && current.revenue
            ? Number(current.revenue) / (current.leads || 1)
            : null,
      },
      newContentSummary: {
        mediaAssets: mediaCount,
        lessons: trainingCount,
      },
      notifications,
    };

    // Cache é opcional - funciona sem Redis
    redis.set(cacheKey, JSON.stringify(summary), 'EX', DASHBOARD_TTL_SECONDS).catch(() => {
      // Silenciosamente ignora erros de cache
    });

    return summary;
  }

  private getMonthStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  private getLastDays(days: number) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }
}

export default new DashboardService();

