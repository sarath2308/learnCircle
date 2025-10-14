import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthConfig } from "@/config/authConfig";
import { injectable, inject } from "inversify";
import { IRedisRepository, TYPES } from "@/common";
import { RedisKeys } from "@/common";
dotenv.config();
type Tpayload = { userId: string; role?: string; type?: string };

export interface ITokenService {
  signAccessToken(payload: Tpayload, expiresIn?: string): string;
  signTempToken(payload: Tpayload, expiresIn?: string): string;
  generateRefreshToken(payload: Tpayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): JwtPayload | null;
  generateTokens(payload: Tpayload): Promise<ITokens>;
  verifyTempToken(token: string): Promise<ITempTokenRes | null>;
}
export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITempTokenRes {
  success: boolean;
  message: string;
  data: Tpayload;
}
@injectable()
export class TokenService implements ITokenService {
  constructor(@inject(TYPES.IRedisRepository) private redisService: IRedisRepository) {}
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

  async generateTokens(payload: Tpayload): Promise<ITokens> {
    let accessToken = await this.signAccessToken(payload);
    let refreshToken = await this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async verifyTempToken(token: string): Promise<ITempTokenRes> {
    try {
      const decoded = jwt.verify(token, AuthConfig.accessTokenSecret) as Tpayload;
      return {
        success: true,
        message: "Token is valid",
        data: decoded,
      };
    } catch (error: any) {
      const decoded = jwt.decode(token) as Tpayload | null;

      if (error instanceof TokenExpiredError) {
        return {
          success: false,
          message: "Token expired",
          data: decoded ?? { userId: "", type: "unknown" },
        };
      } else if (error.name === "JsonWebTokenError") {
        return {
          success: false,
          message: "Invalid token",
          data: decoded ?? { userId: "", type: "unknown" },
        };
      } else {
        throw error;
      }
    }
  }
}
