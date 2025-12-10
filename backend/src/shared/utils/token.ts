import jwt from 'jsonwebtoken';

import env from '../../config/env';
import type { AuthContext } from '../types/roles';

export interface TokenPayload extends AuthContext {
  sessionId?: string;
}

const accessSecret: jwt.Secret = env.JWT_SECRET;
const refreshSecret: jwt.Secret = env.REFRESH_TOKEN_SECRET;
const accessOptions: jwt.SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
};
const refreshOptions: jwt.SignOptions = {
  expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
};

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload as jwt.JwtPayload, accessSecret, accessOptions);

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload as jwt.JwtPayload, refreshSecret, refreshOptions);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret) as TokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret) as TokenPayload;

