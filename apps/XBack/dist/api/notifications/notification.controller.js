"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
class NotificationController {
    constructor() {
        this.notificationService = new notification_service_1.NotificationService();
        this.getNotifications = async (req, res, next) => {
            try {
                const notifications = await this.notificationService.getNotifications(req.userId);
                res.json({ success: true, notifications });
            }
            catch (error) {
                next(error);
            }
        };
        this.getSettings = async (req, res, next) => {
            try {
                const settings = await this.notificationService.getSettings(req.userId);
                res.json({ success: true, settings });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateSettings = async (req, res, next) => {
            try {
                const { notificationsEnabled } = req.body;
                const settings = await this.notificationService.updateSettings(req.userId, notificationsEnabled);
                res.json({ success: true, settings });
            }
            catch (error) {
                next(error);
            }
        };
        this.markAllAsRead = async (req, res, next) => {
            try {
                await this.notificationService.markAllAsRead(req.userId);
                res.json({ success: true });
            }
            catch (error) {
                next(error);
            }
        };
        this.markAsRead = async (req, res, next) => {
            try {
                const notificationId = req.params.id;
                const notification = await this.notificationService.markAsRead(req.userId, notificationId);
                res.json({ success: true, notification });
            }
            catch (error) {
                next(error);
            }
        };
        this.registerToken = async (req, res, next) => {
            try {
                const { token, platform } = req.body;
                const saved = await this.notificationService.registerDeviceToken(req.userId, token, platform);
                res.json({ success: true, token: saved });
            }
            catch (error) {
                next(error);
            }
        };
        this.unregisterToken = async (req, res, next) => {
            try {
                const token = req.body.token || req.params.id;
                await this.notificationService.unregisterDeviceToken(req.userId, token);
                res.json({ success: true });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map