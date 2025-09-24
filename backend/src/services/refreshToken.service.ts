import { IToken } from "../utils/token.jwt";
import { IRedisRepository } from "../Repositories/redisRepo";
import { RedisKeys } from "../constants/redisKeys";
import { injectable } from "inversify";

type refreshRes = {
  access: string;
  refresh: string;
};
export default interface IRefreshTokenService {
  refreshToken: (token: string) => Promise<refreshRes>;
}
@injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private jwtService: IToken,
    private redisService: IRedisRepository<string>,
  ) {}
  async refreshToken(token: string): Promise<refreshRes> {
    const payload = await this.jwtService.verifyRefreshToken(token);

    if (!payload || !payload.userId) {
      throw new Error("Invalid Refresh token");
    }
    const userId = payload.userId;
    const accessToken = await this.jwtService.signAccessToken({ userId });
    const refreshToken = await this.jwtService.generateRefreshToken({ userId });

    await this.redisService.set(`${RedisKeys.REFRESH}:${userId}`, refreshToken, 604800);
    return { access: accessToken, refresh: refreshToken };
  }
}
