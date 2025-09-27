import { Learner } from "../models/Learner";
import Professional from "../models/profesionals";
import { TYPES } from "../types/types";
// import { Admin } from '../models/admin.model';
import { TokenService } from "../utils/token.jwt";
import { inject, injectable } from "inversify";

@injectable()
export class RefreshService {
  constructor(@inject(TYPES.TokenService) protected service: TokenService) {}
  async refreshToken(token: string) {
    const payload: any = await this.service.verifyRefreshToken(token);
    let user;

    switch (payload.role) {
      case "learner":
        user = await Learner.findById(payload.userId);
        break;
      case "professional":
        user = await Professional.findById(payload.userId);
        break;
      // case 'admin':
      //   user = await Admin.findById(payload.userId);
      //   break;
      default:
        throw new Error("Invalid role in token");
    }

    if (!user) throw new Error("User not found");

    // Generate new access token
    const newAccessToken = await this.service.signAccessToken({
      userId: user._id.toString(),
      role: payload.role,
    });

    return { accessToken: newAccessToken, user };
  }
}
