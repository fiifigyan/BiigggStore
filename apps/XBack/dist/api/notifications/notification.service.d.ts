export declare class NotificationService {
    getNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        body: string;
        type: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    registerDeviceToken(userId: string, token: string, platform?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        platform: string | null;
    }>;
    unregisterDeviceToken(userId: string, tokenOrId: string): Promise<import(".prisma/client").Prisma.BatchPayload | {
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        platform: string | null;
    }>;
    getSettings(userId: string): Promise<{
        notificationsEnabled: boolean;
    }>;
    updateSettings(userId: string, notificationsEnabled: boolean): Promise<{
        notificationsEnabled: boolean;
    }>;
    markAsRead(userId: string, notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        body: string;
        type: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    createNotification(userId: string, title: string, body: string, type?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        body: string;
        type: string;
        isRead: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
//# sourceMappingURL=notification.service.d.ts.map