import { AppError, HttpStatus, IRedisRepository, ITokens, ITokenService, Messages } from "@/common";
import { RedisKeys } from "../constants/redisKeys";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/inversify/types";

export interface IRefreshTokenService {
  refreshToken: (token: string) => Promise<ITokens>;
}
@injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,

    @inject(TYPES.IRedisRepository) private _redisService: IRedisRepository,
  ) {}
  async refreshToken(token: string): Promise<ITokens> {
    const payload = await this._tokenService.verifyRefreshToken(token);

    if (!payload || !payload.userId) {
      throw new AppError(Messages.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    const userId = payload.userId;

    let tokens = await this._tokenService.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });

    await this._redisService.set(`${RedisKeys.REFRESH}:${userId}`, tokens.refreshToken, 604800);
    return tokens;
  }
}
