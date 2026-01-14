import { Router } from 'express';
import { userController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', requireAuth, userController.getProfile);
router.post('/update-profile', requireAuth, userController.updateProfile);
router.post('/change-password', requireAuth, userController.changePassword);
router.post('/connect-roblox', requireAuth, userController.connectRoblox);
router.get('/me/roblox-assets', requireAuth, userController.getMyRobloxAssets);
router.post("/googlelogin", userController.googleLogin)
router.get("/googleAuth", userController.googleAuth);
router.post("/forgot/password", userController.forgotPassword);
router.post("/reset/password", userController.resetPassword);

export default router;

