import { Schema, model } from "mongoose";

const disputeSchema = new Schema({
    orderId: { type: String, required: true },
    openedBy: { type: String, required: true },
    reason: { type: String, required: true, enum: ['no_delivery', 'wrong_item', 'late_delivery', 'suspected_scam'] },
    messages: [
        {
            senderId: { type: String, required: true },
            message: { type: String, required: true },
        }
    ],

    status: { type: String, required: true, enum: ['open', 'resolved', 'rejected'] },

    resolution: {
        decision: { type: String, required: false, enum: ['refund_buyer', 'release_seller'] },
        adminId: { type: String, required: false },
        resolvedAt: { type: Date, default: Date.now },
    },

    createdAt: { type: Date, default: Date.now },
});

export const Disputes = model('Disputes', disputeSchema);