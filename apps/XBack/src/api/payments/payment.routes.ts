import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new PaymentController();

router.use(authenticate);
router.post('/initiate', controller.initiate);
router.post('/verify', controller.verify);

export default router;
