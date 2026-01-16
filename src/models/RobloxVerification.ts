import { Schema, model } from "mongoose";

const robloxVerificationSchema = new Schema({
    userId: { type: String, required: true, index: true },
    robloxUsername: { type: String, required: true },
    robloxUserId: { type: String }, // Resolved after username lookup
    verificationCode: { type: String, required: true, unique: true, index: true },
    status: { 
        type: String, 
        enum: ['pending', 'verified', 'expired', 'failed'], 
        default: 'pending' 
    },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date },
    failureReason: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Auto-expire old pending verifications (MongoDB TTL index)
// Note: expireAfterSeconds: 0 means documents expire when expiresAt date is reached
// Using a unique name to prevent duplicate index warnings
robloxVerificationSchema.index({ expiresAt: 1 }, { 
    expireAfterSeconds: 0,
    name: 'roblox_verification_expiresAt_ttl',
    background: true
});

export const RobloxVerification = model("RobloxVerification", robloxVerificationSchema);

