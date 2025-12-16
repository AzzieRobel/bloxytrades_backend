import { Router } from 'express';
import { disputeController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', requireAuth, disputeController.createDispute);
router.post('/:id/resolve', requireAuth, disputeController.resolveDispute);

export default router;

