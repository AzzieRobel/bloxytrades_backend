import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  assetId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  transactionType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Transactions = model('Transactions', transactionSchema);