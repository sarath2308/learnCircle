import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthConfig } from "../config/authConfig";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { RedisRepository } from "../Repositories/redisRepo";
import { RedisKeys } from "../constants/redisKeys";
dotenv.config();
type Tpayload = { userId: string; role?: string; type?: string };

export interface IToken {
  signAccessToken(payload: Tpayload, expiresIn?: string): string;
  signTempToken(payload: Tpayload, expiresIn?: string): string;
  generateRefreshToken(payload: Tpayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
}
@injectable()
export class TokenService {
  constructor(@inject(TYPES.RedisRepository) private redisService: RedisRepository<string>) {}
  signTempToken(payload: Tpayload): string {
    return jwt.sign(payload, AuthConfig.accessTokenSecret, {
      expiresIn: "5m",
    });
  }

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
  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = jwt.verify(token, AuthConfig.refreshTokenSecret) as JwtPayload;

      if (!payload || !payload.userId) return null;

      const storedToken = await this.redisService.get(`${RedisKeys.REFRESH}:${payload.userId}`);
      if (storedToken !== token) {
        console.log("Refresh token invalidated in Redis");
        return null;
      }

      return payload;
    } catch (err) {
      console.log("Refresh token verification failed", err);
      return null;
    }
  }
}
