import { Router } from 'express';
import { userController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', requireAuth, userController.getProfile);
router.post('/update-profile', requireAuth, userController.updateProfile);
router.post('/change-password', requireAuth, userController.changePassword);
router.post('/connect-roblox', requireAuth, userController.connectRoblox); // Legacy endpoint
router.get('/me/roblox-assets', requireAuth, userController.getMyRobloxAssets);

// Roblox profile verification endpoints
router.post('/roblox/verify/initiate', requireAuth, userController.initiateRobloxVerification);
router.post('/roblox/verify/check', requireAuth, userController.verifyRobloxCode);
router.get('/roblox/verify/pending', requireAuth, userController.getPendingRobloxVerification);
router.post('/roblox/verify/cancel', requireAuth, userController.cancelRobloxVerification);
router.post("/googlelogin", userController.googleLogin)
router.get("/googleAuth", userController.googleAuth);
router.post("/forgot/password", userController.forgotPassword);
router.post("/reset/password", userController.resetPassword);

export default router;

