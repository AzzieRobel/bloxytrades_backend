import { Schema, model } from "mongoose";

const listingSchema = new Schema({
  sellerId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

export const Listings = model('Listings', listingSchema);

