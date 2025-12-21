import { Router } from 'express';
import { authController } from '../controllers';
import { verificationController } from '../controllers/verificationController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/refresh', authController.refreshSession);

// Email Verification Routes
router.get('/verify-email/:token', verificationController.verifyEmail);
router.post('/resend-verification', requireAuth, verificationController.resendVerification);

export default router;