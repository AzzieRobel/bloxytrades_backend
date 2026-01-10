import { Router } from "express";

import userRoutes from "./userRoutes";
import sellerRoutes from "./sellerRoutes";
import buyerRoutes from "./buyerRoutes";
import listingRoutes from "./listingRoutes";
import orderRoutes from "./orderRoutes";
import disputeRoutes from "./disputeRoutes";
import adminRoutes from "./adminRoutes";
import paymentRoutes from "./paymentRoutes";
import authRoutes from "./authRoutes";
import robloxRoutes from "./robloxRoutes";

const router = Router()

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sellers', sellerRoutes);
router.use('/buyers', buyerRoutes);
router.use('/listings', listingRoutes);
router.use('/orders', orderRoutes);
router.use('/disputes', disputeRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/roblox', robloxRoutes);

export default router;