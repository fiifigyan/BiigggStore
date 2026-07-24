import { Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { AuthRequest } from '../../middleware/auth';

export class NotificationController {
  private notificationService = new NotificationService();

  getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.notificationService.getNotifications(req.userId!);
      res.json({ success: true, notifications });
    } catch (error) {
      next(error);
    }
  };

  getSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const settings = await this.notificationService.getSettings(req.userId!);
      res.json({ success: true, settings });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { notificationsEnabled } = req.body;
      const settings = await this.notificationService.updateSettings(req.userId!, notificationsEnabled);
      res.json({ success: true, settings });
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.markAllAsRead(req.userId!);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notificationId = req.params.id as string;
      const notification = await this.notificationService.markAsRead(req.userId!, notificationId);
      res.json({ success: true, notification });
    } catch (error) {
      next(error);
    }
  };

  registerToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { token, platform } = req.body;
      const saved = await this.notificationService.registerDeviceToken(req.userId!, token, platform);
      res.json({ success: true, token: saved });
    } catch (error) {
      next(error);
    }
  };

  unregisterToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.body.token || req.params.id;
      await this.notificationService.unregisterDeviceToken(req.userId!, token);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
