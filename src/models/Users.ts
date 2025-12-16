import { Schema, model } from "mongoose";

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  flags: {
    isBanned: { type: Boolean, default: false, required: false },
    isVerifiedSeller: { type: Boolean, default: false, required: false },
    requiresManualReview: { type: Boolean, default: false, required: false }
  },
  referralCode: { type: String, required: false, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Users = model('Users', userSchema);

export default Users;