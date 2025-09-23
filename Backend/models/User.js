// models/User.js
import mongoose from "mongoose";
// const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  tokenHash: String,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  refreshTokens: [refreshTokenSchema],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
