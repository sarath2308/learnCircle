import { injectable, inject } from "inversify";
import { UserResponseDto } from "../dtos";
import { IAuthProviderService } from "../interface/IAuthProviderService";
import { TYPES } from "../types";
import { ITokens, ITokenService } from "../utils";
import { verifyGoogleToken } from "../utils";
import { IUserRepo } from "../Repo";
import { Providers } from "../constants/providers";
import { Role } from "@/common";
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
  async signIn(
    token: string,
    role: string,
  ): Promise<{ user: UserResponseDto; tokens: ITokens } | null> {
    try {
      const payload = await verifyGoogleToken(token);

      if (!payload) {
        throw new Error("Invalid Google token");
      }

      const { email, name = "No Name", emailVerified, sub } = payload;

      if (!email || !emailVerified) {
        throw new Error("Google account not verified");
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
          throw new Error("User creation failed");
        }
      }
      let tokens = await this._tokenService.generateTokens({ userId: user.id, role: user.role });
      let userDto = await this._userDtoMap.toResponse(user);
      return { user: userDto, tokens };
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error) throw new Error(err.message || "Google sign-in failed");
      throw err;
    }
  }
}
