import { injectable, inject } from "inversify";
import { UserResponseDto } from "@/schema/shared/auth/auth.dto.schema";
import { IAuthProviderService } from "@/interface/shared/auth/auth.provider.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { ITokens, ITokenService, verifyGoogleToken } from "@/utils";
import { IUserRepo } from "@/repos/shared/user.repo";
import { Providers } from "@/constants/shared/providers";
import { IUserDtoMapper } from "@/mapper/shared/user.map";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { Provider, Role } from "@/types";
import { IS3Service } from "@/interface/shared/s3.service.interface";

@injectable()
export class GoogleAuthProvider implements IAuthProviderService {
  readonly providerName = Providers.Google;
  constructor(
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IUserRepo) private _userRepo: IUserRepo,
    @inject(TYPES.IUserDtoMapper) private _userDtoMap: IUserDtoMapper,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
  ) {}
  /**
   *
   * @param token
   * @param role
   * @returns
   */
  async signIn(token: string, role: string): Promise<{ user: UserResponseDto; tokens: ITokens }> {
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
