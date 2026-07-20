import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Types } from 'mongoose';

export const generateTokens = (userId: Types.ObjectId | string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string; role: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; role: string };
};
