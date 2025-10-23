import { injectable, inject } from "inversify";
import { UserResponseDto } from "../dtos";
import { IAuthProviderService } from "../interface/IAuthProviderService";
import { TYPES } from "../types/inversify/types";
import { ITokens, ITokenService } from "../utils";
import { verifyGoogleToken } from "../utils";
import { IUserRepo } from "../Repo";
import { Providers } from "../constants/providers";
import { AppError, HttpStatus, Messages, Role } from "@/common";
import { IUserDtoMapper } from "../dtos/mapper/user.map";
import type { Provider } from "@/common";

@injectable()
export class GoogleAuthProvider implements IAuthProviderService {
  readonly providerName = Providers.Google;
  constructor(
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
    @inject(TYPES.IUserDtoMapper) private _userDtoMap: IUserDtoMapper,
  ) {}
  /**
   *
   * @param token
   * @param role
   * @returns
   */
  async signIn(
    token: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null> {
    const payload = await verifyGoogleToken(token);

    if (!payload) {
      throw new AppError(Messages.GOOGLE_AUTH_FAILED, HttpStatus.UNAUTHORIZED);
    }

    const { email, name = "No Name", emailVerified, sub } = payload;

    if (!email || !emailVerified) {
      throw new AppError("Google account not verified", HttpStatus.NOT_FOUND);
    }

    let user = await this._userRepo.findByEmail(email);

    if (!user) {
      user = await this._userRepo.create({
        name,
        email,
        providers: [{ provider: Providers.Google as Provider, providerId: sub }],
        role: role as Role,
      });

      if (!user) {
        throw new AppError(Messages.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
    }
    let tokens = await this._tokenService.generateTokens({ userId: user.id, role: user.role });

    let userDto = await this._userDtoMap.toResponse(user);

    return { user: userDto, tokens };
  }
}
