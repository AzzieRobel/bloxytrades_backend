import { Router } from 'express';
import { authController } from '../controllers';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/refresh', authController.refreshSession);

export default router;