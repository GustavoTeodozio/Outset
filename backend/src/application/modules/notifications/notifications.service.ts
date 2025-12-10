import prisma from '../../../config/prisma';

export class NotificationsService {
  list(tenantId: string) {
    return prisma.notification.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  markAsRead(notificationId: string, tenantId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, tenantId },
      data: { isRead: true },
    });
  }
}

export default new NotificationsService();

