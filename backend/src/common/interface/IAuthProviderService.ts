export interface IAuthProviderService {
  signIn(token: string): Promise<{ user: IUserDto; tokens: Tokens }>;
}
