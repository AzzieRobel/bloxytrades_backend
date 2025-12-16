import { Router } from 'express';
import { adminController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/adminMiddleware';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/stats', adminController.getStats);
router.post('/users/:id/ban', adminController.banUser);

export default router;

