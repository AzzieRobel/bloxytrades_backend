import { Schema, model } from "mongoose";

const userSchema = new Schema({
  id: { type: String, unique: true, index: true },
  username: { type: String, unique: true, sparse: true, index: true },
  email: { type: String, unique: true, sparse: true, index: true },

  passwordHash: String,
  googleId: { type: String, unique: true, sparse: true, index: true },

  robloxUserId: String,
  robloxUsername: String,
  robloxVerifiedAt: Date,

  isBanned: Boolean,
  isVerifiedSeller: Boolean,
  banReason: String,

  // Email Verification Fields
  emailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  emailVerifiedAt: Date,

  referralCode: String,
  createdAt: Date,
  lastLoginAt: Date,

  // Google OAuth fields
  googleAccessToken: String,
  googleRefreshToken: String,
  googleTokenExpiry: Date,
});

export const Users = model('Users', userSchema);

export default Users;