import { Router } from 'express';
import { listingController } from '../controllers';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', listingController.getListings);
router.get('/mine', requireAuth, listingController.getMyListings);
router.post('/', requireAuth, listingController.createListing);
router.put('/:id', requireAuth, listingController.updateListing);

export default router;

