import { Learner } from "../models/Learner";
import Professional from "../models/profesionals";
// import { Admin } from '../models/admin.model';
import { TokenService } from "../utils/token.jwt";
import { injectable } from "inversify";

const service = new TokenService();
@injectable()
export class RefreshService {
  static async refreshToken(token: string) {
    try {
      const payload: any = service.verifyRefreshToken(token);
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
      const newAccessToken = service.signAccessToken({ userId: user._id, role: payload.role });

      return { accessToken: newAccessToken, user };
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }
}
