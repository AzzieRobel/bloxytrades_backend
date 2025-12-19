import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const orderSchema = new Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  listingId: { type: String, required: true },
  price: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const Orders = model('Orders', orderSchema);

