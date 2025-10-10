import { injectable, inject } from "inversify";
import { TYPES } from "../types";
import { IRepositoryFactory } from "./roleRepoFatcory.service";

export interface IEmailAuthService {
  signup(data: { name: string; email: string; password: string; role: string }): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<{ user: IUserDto; tokens: Tokens }>;
  login(email: string, password: string): Promise<{ user: IUserDto; tokens: Tokens }>;
}
@injectable()
export class EmailAuthService implements IEmailAuthService {
  constructor(@inject(TYPES.IRoleRepoFactory) private _repoFactory: IRepositoryFactory) {}
  async signup(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<void> {
    const userRepo = await this._repoFactory.getRepository(data.role);
    const match = await userRepo.findByEmail(email);

    if (match) {
      throw new Error("already exist");
    }
    const otp = this.OtpService.getOtp();
    const passwordHash = await this.passwordService.hashPassword(password);
    //redis
    await this.redis.set(
      `signup:${email}`,
      JSON.stringify({ name, email, passwordHash: passwordHash, otp }),
      60,
    );
    //email
    await this.emailService.sendSignupOtp(email, otp);

    return { message: "otp sent for verification" };
  }
  async verifyOtp(email: string, otp: string): Promise<{ user: IUserDto; tokens: Tokens }> {}
  async login(email: string, password: string): Promise<{ user: IUserDto; tokens: Tokens }> {}
}
