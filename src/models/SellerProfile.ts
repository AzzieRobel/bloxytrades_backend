import { Schema, model } from "mongoose";

const payoutMethodSchema = new Schema({
    stripeConnected: Boolean,
    paypalEmail: String,
    cryptoWallets: {
        btc: String,
        eth: String,
        usdt: String
    }
});

const sellerProfileSchema = new Schema({
    userId: { type: String, required: true, unique: true, index: true },
    isEnabled: { type: Boolean, required: true, default: false },
    isPremium: { type: Boolean, required: true, default: false },
    rating: { type: Number, required: false, default: 0, min: 0, max: 5 },
    completedOrder: { type: Number, required: false, default: 0 },
    failedOrders: { type: Number, required: false, default: 0 },
    disputedCounts: { type: Number, required: false, default: 0 },
    payoutMethod: payoutMethodSchema,
    suspendedUntil: { type: Boolean, required: true, default: false },
    suspensionReason: { type: String },
});

export const SellerProfile = model("SellerProfile", sellerProfileSchema);