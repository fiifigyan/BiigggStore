import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

export class NotificationService {
  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async registerDeviceToken(userId: string, token: string, platform?: string) {
    // Upsert token
    return prisma.deviceToken.upsert({
      where: { token },
      update: { userId, platform },
      create: { userId, token, platform },
    });
  }

  async unregisterDeviceToken(userId: string, tokenOrId: string) {
    // try by id first
    const byId = await prisma.deviceToken.findUnique({ where: { id: tokenOrId } }).catch(() => null);
    if (byId && byId.userId === userId) {
      return prisma.deviceToken.delete({ where: { id: tokenOrId } });
    }

    // fallback: delete by token value
    return prisma.deviceToken.deleteMany({ where: { token: tokenOrId, userId } });
  }

  async getSettings(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationsEnabled: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateSettings(userId: string, notificationsEnabled: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { notificationsEnabled },
      select: { notificationsEnabled: true },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(
    userId: string,
    title: string,
    body: string,
    type: string = 'info'
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type,
      },
    });

    // Send push via Expo push service if user has device tokens and enabled notifications
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { notificationsEnabled: true } });
      if (!user || user.notificationsEnabled === false) return notification;

      const tokens = await prisma.deviceToken.findMany({ where: { userId }, select: { token: true } });
      const messages = tokens.map(t => ({
        to: t.token,
        title,
        body,
        data: { notificationId: notification.id, type },
      }));

      // Expo accepts up to 100 messages per request
      const chunkSize = 100;
      for (let i = 0; i < messages.length; i += chunkSize) {
        const chunk = messages.slice(i, i + chunkSize);
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chunk),
        });
      }
    } catch (err) {
      console.error('Push send error:', err);
    }

    return notification;
  }
}
