// utils/tokens.js

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export const createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
  });
};

export const createRefreshToken = async (userId) => {
  const tokenId = uuidv4();
  const refreshJwt = jwt.sign({ userId: userId.toString(), tokenId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
  });
  const tokenIdHash = await bcrypt.hash(tokenId, 12);
  return { refreshJwt, tokenId, tokenIdHash };
};

// export default { createAccessToken, createRefreshToken };
