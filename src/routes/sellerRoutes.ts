import { Router } from 'express';
import { sellerController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', requireAuth, sellerController.getSellerProfile);
router.put('/me', requireAuth, sellerController.updateSellerProfile);
router.get('/me/dashboard', requireAuth, sellerController.getDashboard);
router.get('/me/sales', requireAuth, sellerController.getSalesHistory);

export default router;

