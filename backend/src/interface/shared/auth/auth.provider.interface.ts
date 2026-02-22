import { UserResponseDto } from "@/schema/shared/auth/auth.dto.schema";
import { ITokens } from "@/utils";

export interface IAuthProviderService {
  readonly providerName: string;
  signIn(token: string, role: string): Promise<{ user: UserResponseDto; tokens: ITokens }>;
}
