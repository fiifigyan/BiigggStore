import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new NotificationController();

router.use(authenticate);
router.get('/settings', controller.getSettings);
router.put('/settings', controller.updateSettings);
router.patch('/read-all', controller.markAllAsRead);
router.get('/', controller.getNotifications);
router.patch('/:id/read', controller.markAsRead);
router.post('/device/register', controller.registerToken);
router.post('/device/unregister', controller.unregisterToken);

export default router;
