import { Router } from 'express';
import { buyerController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/me', requireAuth, buyerController.getBuyerProfile);
router.put('/me', requireAuth, buyerController.updateBuyerProfile);

export default router;

