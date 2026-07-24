import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new UserController();

router.use(authenticate);
router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.get('/addresses', controller.getAddresses);
router.post('/addresses', controller.addAddress);
router.put('/addresses/:id', controller.updateAddress);
router.delete('/addresses/:id', controller.deleteAddress);

export default router;