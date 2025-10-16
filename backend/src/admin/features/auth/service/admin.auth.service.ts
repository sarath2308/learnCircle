import { inject, injectable } from "inversify";
import { TYPES } from "@/common";
import { AdminRepo } from "@/admin";
import { TokenService } from "@/common";

@injectable()
export class AdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository) private Repo: AdminRepo,
    @inject(TYPES.TokenService) private TokenService: TokenService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.Repo.findByEmail(email);
    if (!user) {
      throw new Error("user not found");
    }
    if (user.passwordHash! == password) {
      throw new Error("incorrect password");
    }
    let access = await this.TokenService.signAccessToken({ userId: user.id, role: "admin" });
    let refresh = await this.TokenService.generateRefreshToken({
      userId: user.id,
      role: "admin",
    });
    return { user: user, access: access, refresh: refresh };
  }
}
