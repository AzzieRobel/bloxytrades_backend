import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, require: true, unique: false },
  email: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Users = model('Users', userSchema);

