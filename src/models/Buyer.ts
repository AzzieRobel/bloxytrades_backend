import { Schema, model } from "mongoose";

const buyerSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  profile: {
    displayName: { type: String },
    avatar: { type: String },
    contact: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Buyers = model('Buyers', buyerSchema);

