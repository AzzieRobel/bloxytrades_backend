import { Router } from 'express';
import { payWithCrypto, payWithPaypal, payWithStripe } from '../controllers/paymentController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/stripe', requireAuth, payWithStripe);
router.post('/paypal', requireAuth, payWithPaypal);
router.post('/crypto', requireAuth, payWithCrypto);

export default router;

