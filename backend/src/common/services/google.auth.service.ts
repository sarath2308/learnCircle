import { IAuthProviderService } from "../interface/IAuthProviderService";

export class GoogleAuthProvider implements IAuthProviderService {
  constructor() {}
  signIn(token: string): Promise<{ user: IUserDto; tokens: Tokens }> {}
}
