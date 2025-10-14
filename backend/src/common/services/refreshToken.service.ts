import { IToken } from "../utils/token.service";
import { IRedisRepository } from "@/common";
import { RedisKeys } from "../constants/redisKeys";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/inversify/types";

type refreshRes = {
  access: string;
  refresh: string;
};
export interface IRefreshTokenService {
  refreshToken: (token: string) => Promise<refreshRes>;
}
@injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @inject(TYPES.TokenService) private jwtService: IToken,
    @inject(TYPES.RedisRepository) private redisService: IRedisRepository<string>,
  ) {}
  async refreshToken(token: string): Promise<refreshRes> {
    const payload = await this.jwtService.verifyRefreshToken(token);

    if (!payload || !payload.userId) {
      throw new Error("Invalid Refresh token");
    }
    const userId = payload.userId;
    const accessToken = await this.jwtService.signAccessToken({ userId, role: payload.role });
    if (!accessToken) throw new Error("Failed to generate access token");

    const refreshToken = await this.jwtService.generateRefreshToken({ userId, role: payload.role });
    if (!refreshToken) throw new Error("Failed to generate refresh token");

    console.log(accessToken, refreshToken);
    await this.redisService.set(`${RedisKeys.REFRESH}:${userId}`, refreshToken, 604800);
    return { access: accessToken, refresh: refreshToken };
  }
}
