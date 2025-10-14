import { UserResponseDto } from "../dtos";
import { ITokens } from "../utils";

export interface IAuthProviderService {
  readonly providerName: string;
  signIn(token: string, role: string): Promise<{ user: UserResponseDto; tokens: ITokens } | null>;
}
