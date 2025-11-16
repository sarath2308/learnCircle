import { injectable, inject } from "inversify";
import { UserResponseDto } from "@/schema/shared/auth.dto.schema";
import { IAuthProviderService } from "@/interface/shared/IAuthProviderService";
import { TYPES } from "@/types/shared/inversify/types";
import { ITokens, ITokenService, verifyGoogleToken } from "@/utils";
import { IUserRepo } from "@/repos/shared/user.repo";
import { Providers } from "@/constants/shared/providers";
import { IUserDtoMapper } from "@/mapper/shared/user.map";
import type { Provider } from "react";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { Role } from "@/types";

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
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | void> {
    const payload = await verifyGoogleToken(token);

    if (!payload) {
      throw new AppError(Messages.GOOGLE_AUTH_FAILED, HttpStatus.UNAUTHORIZED);
    }

    const { email, name = "No Name", emailVerified, sub } = payload;

    if (!email || !emailVerified) {
      throw new AppError("Google account not verified", HttpStatus.NOT_FOUND);
    }

    let user = await this._userRepo.findWithEmailAndRole(email, role);

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
    } else {
      if (user.isBlocked) {
        throw new AppError(Messages.BLOCKED_USER, HttpStatus.FORBIDDEN);
      }
    }
    let tokens = await this._tokenService.generateTokens({ userId: user.id, role: user.role });

    let userDto = await this._userDtoMap.toResponse(user);

    return { user: userDto, tokens };
  }
}
