import { Router } from 'express';
import { CartController } from './cart.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new CartController();

router.use(authenticate);
router.get('/', controller.getCart);
router.post('/items', controller.addItem);
router.put('/items/:itemId', controller.updateQuantity);
router.delete('/items/:itemId', controller.removeItem);
router.delete('/clear', controller.clearCart);

export default router;