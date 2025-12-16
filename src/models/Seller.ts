import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  profile: {
    storeName: { type: String },
    description: { type: String },
    contact: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Sellers = model('Sellers', sellerSchema);

