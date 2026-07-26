import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
export declare class NotificationController {
    private notificationService;
    getNotifications: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getSettings: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateSettings: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    markAllAsRead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    markAsRead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    registerToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    unregisterToken: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=notification.controller.d.ts.map