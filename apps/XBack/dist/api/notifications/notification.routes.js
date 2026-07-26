"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
const controller = new notification_controller_1.NotificationController();
router.use(auth_1.authenticate);
router.get('/settings', controller.getSettings);
router.put('/settings', controller.updateSettings);
router.patch('/read-all', controller.markAllAsRead);
router.get('/', controller.getNotifications);
router.patch('/:id/read', controller.markAsRead);
router.post('/device/register', controller.registerToken);
router.post('/device/unregister', controller.unregisterToken);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map