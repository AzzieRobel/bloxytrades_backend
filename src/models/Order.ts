import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  listingId: { type: String, required: true },
  price: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Orders = model('Orders', orderSchema);

