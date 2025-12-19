import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const listingSchema = new Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  sellerId: { type: String, required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Object, required: true },
  acceptedPayments: { type: Object, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Listing = model('Listing', listingSchema);