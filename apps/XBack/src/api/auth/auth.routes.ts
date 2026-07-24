import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.getMe);
router.post('/refresh', authenticate, controller.refreshToken);

export default router;