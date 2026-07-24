import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new OrderController();

router.use(authenticate);
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/status', controller.getStatus);
router.post('/:id/cancel', controller.cancel);

export default router;