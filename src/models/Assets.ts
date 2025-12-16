import { Schema, model } from "mongoose";

const assetSchema = new Schema({
  assetId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  address: { type: String, required: true },
  decimals: { type: Number, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Assets = model('Assets', assetSchema);