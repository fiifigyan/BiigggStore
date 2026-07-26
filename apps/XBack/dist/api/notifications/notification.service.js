"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = require("../../lib/prisma");
const errorHandler_1 = require("../../middleware/errorHandler");
class NotificationService {
    async getNotifications(userId) {
        return prisma_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async registerDeviceToken(userId, token, platform) {
        // Upsert token
        return prisma_1.prisma.deviceToken.upsert({
            where: { token },
            update: { userId, platform },
            create: { userId, token, platform },
        });
    }
    async unregisterDeviceToken(userId, tokenOrId) {
        // try by id first
        const byId = await prisma_1.prisma.deviceToken.findUnique({ where: { id: tokenOrId } }).catch(() => null);
        if (byId && byId.userId === userId) {
            return prisma_1.prisma.deviceToken.delete({ where: { id: tokenOrId } });
        }
        // fallback: delete by token value
        return prisma_1.prisma.deviceToken.deleteMany({ where: { token: tokenOrId, userId } });
    }
    async getSettings(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { notificationsEnabled: true },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return user;
    }
    async updateSettings(userId, notificationsEnabled) {
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data: { notificationsEnabled },
            select: { notificationsEnabled: true },
        });
    }
    async markAsRead(userId, notificationId) {
        const notification = await prisma_1.prisma.notification.findFirst({
            where: { id: notificationId, userId },
        });
        if (!notification) {
            throw new errorHandler_1.AppError('Notification not found', 404);
        }
        return prisma_1.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return prisma_1.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async createNotification(userId, title, body, type = 'info') {
        const notification = await prisma_1.prisma.notification.create({
            data: {
                userId,
                title,
                body,
                type,
            },
        });
        // Send push via Expo push service if user has device tokens and enabled notifications
        try {
            const user = await prisma_1.prisma.user.findUnique({ where: { id: userId }, select: { notificationsEnabled: true } });
            if (!user || user.notificationsEnabled === false)
                return notification;
            const tokens = await prisma_1.prisma.deviceToken.findMany({ where: { userId }, select: { token: true } });
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
        }
        catch (err) {
            console.error('Push send error:', err);
        }
        return notification;
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map