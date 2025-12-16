import { Router } from 'express';
import { userController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', requireAuth, userController.getProfile);
router.put('/me', requireAuth, userController.updateProfile);

export default router;

