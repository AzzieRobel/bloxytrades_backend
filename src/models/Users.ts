import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },

  passwordHash: { type: String, required: true },

  robloxUserId: { type: String, required: false, unique: true },
  robloxUsername: { type: String, required: false },
  robloxVerifiedAt: { type: Date, required: false },

  isBanned: { type: Boolean, default: false, required: false },
  isVerifiedSeller: { type: Boolean, default: false, required: false },
  banReason: { type: String, required: false },

  referralCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, required: false },
});

export const Users = model('Users', userSchema);

export default Users;