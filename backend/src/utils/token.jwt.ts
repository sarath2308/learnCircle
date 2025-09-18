import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthConfig } from "../config/authConfig";
dotenv.config();
type Tpayload = { userId: string };

export interface IToken {
  signAccessToken(payload: Tpayload, expiresIn?: string): string;
  generateRefreshToken(payload: Tpayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
}

export class TokenService {
  signAccessToken(payload: Tpayload): string {
    return jwt.sign(payload, AuthConfig.accessTokenSecret, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    });
  }

  generateRefreshToken(payload: Tpayload): string {
    return jwt.sign(payload, AuthConfig.refreshTokenSecret, {
      expiresIn: AuthConfig.refreshTokenExpiresIn,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, AuthConfig.accessTokenSecret) as JwtPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, AuthConfig.refreshTokenSecret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
