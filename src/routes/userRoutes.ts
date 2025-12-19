import { Router } from 'express';
import { userController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', requireAuth, userController.getProfile);
router.post('/update-profile', requireAuth, userController.updateProfile);
router.post('/change-password', requireAuth, userController.changePassword);
router.post('/connect-roblox', requireAuth, userController.connectRoblox);

export default router;

