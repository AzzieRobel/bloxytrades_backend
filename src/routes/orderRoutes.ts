import { Router } from 'express';
import { orderController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', requireAuth, orderController.createOrder);
router.patch('/:id/status', requireAuth, orderController.updateOrderStatus);
router.post('/:id/release', requireAuth, orderController.releaseOrder);

export default router;

