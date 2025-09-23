// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from '../Utils/Token.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // match REFRESH_TOKEN_EXPIRY
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already used' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = new User({ name, email, passwordHash });
  await user.save();

  const accessToken = createAccessToken(user._id);
  const { refreshJwt, tokenIdHash } = await createRefreshToken(user._id);

  // store hashed tokenId
  user.refreshTokens.push({ tokenHash: tokenIdHash });
  await user.save();

  res.cookie('refreshToken', refreshJwt, COOKIE_OPTIONS);
  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid creds' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid creds' });

  const accessToken = createAccessToken(user._id);
  const { refreshJwt, tokenIdHash } = await createRefreshToken(user._id);

  user.refreshTokens.push({ tokenHash: tokenIdHash });
  await user.save();

  res.cookie('refreshToken', refreshJwt, COOKIE_OPTIONS);
  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email }
  });
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No token' });

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const { userId, tokenId } = payload;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    // find matching hashed token
    let foundIndex = -1;
    for (let i = 0; i < user.refreshTokens.length; i++) {
      const match = await bcrypt.compare(tokenId, user.refreshTokens[i].tokenHash);
      if (match) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex === -1) {
      // possible reuse attack — revoke all tokens
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // rotate: remove old token and add a new one
    user.refreshTokens.splice(foundIndex, 1);
    const { refreshJwt, tokenIdHash } = await createRefreshToken(user._id);
    user.refreshTokens.push({ tokenHash: tokenIdHash });
    await user.save();

    const accessToken = createAccessToken(user._id);
    res.cookie('refreshToken', refreshJwt, COOKIE_OPTIONS);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Could not refresh' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      return res.json({ ok: true });
    }
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const { userId, tokenId } = payload;
    const user = await User.findById(userId);
    if (user) {
      // remove matching refresh token only
      for (let i = 0; i < user.refreshTokens.length; i++) {
        const match = await bcrypt.compare(tokenId, user.refreshTokens[i].tokenHash);
        if (match) {
          user.refreshTokens.splice(i, 1);
          break;
        }
      }
      await user.save();
    }
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ ok: true });
  } catch (e) {
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    return res.status(200).json({ ok: true });
  }
};

