import { EmailService } from "../utils/emailService";
import { GenerateOtp } from "../utils/otp.utils.";
import { IToken } from "../utils/token.jwt";
import { IRedisRepository } from "../Repositories/redisRepo";
import { IpasswordService } from "../utils/passwordService";
import { verifyGoogleToken } from "../utils/googleAuth";
import { IAuthService } from "../types/common/IAuthService";
import { LearnerRepo } from "../Repositories/learner/learnerRepo";
import { ProfesionalRepo } from "../Repositories/profesional/profesionalRepo";
import { CloudinaryService } from "../utils/cloudinary.service";

export class AuthService implements IAuthService {
  constructor(
    protected userRepo: LearnerRepo | ProfesionalRepo,
    protected emailService: EmailService,
    protected OtpService: GenerateOtp,
    protected accesToken: IToken,
    protected redis: IRedisRepository<any>,
    protected passwordService: IpasswordService,
    protected cloudinary: CloudinaryService,
  ) {}
  async signup(name: string, email: string, password: string): Promise<object> {
    try {
      const match = await this.userRepo.findByEmail(email);

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
    } catch (err: any) {
      if (err.code === 11000) {
        throw new Error("duplicate_error");
      } else {
        throw err;
      }
    }
  }

  async login(email: string, password: string) {
    try {
      const match = await this.userRepo.findByEmail(email);
      if (match) {
        if (!match.passwordHash) {
          throw new Error("password not set please use google Auth");
        }
        const check = await this.passwordService.comparePassword(match.passwordHash, password);
        if (!check) {
          throw new Error("incorrect Password");
        }
        const jwt = await this.accesToken.signAccessToken({ userId: match.id, role: match.role });
        let imageUrl = "";
        //signed url
        if (match?.publicId) {
          imageUrl = await this.cloudinary.generateSignedUrl(match.publicId);
        }

        return { user: match, accessToken: jwt };
      } else {
        throw new Error("user not found");
      }
    } catch (err: any) {
      throw new Error(err);
    }
  }
  async forgotPassword(email: string) {
    try {
      const match = await this.userRepo.findByEmail(email);

      if (!match) {
        throw new Error("User not found");
      }
      const otp = this.OtpService.getOtp();

      await this.redis.set(`forgot:${email}`, JSON.stringify({ email, otp }), 60);
      //email
      await this.emailService.sendSignupOtp(email, otp);

      return { message: "otp sent for verification" };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const match = await this.redis.get(`reset:${token}`);
    if (!match) {
      throw new Error("Session expired");
    }
    const { id: userId } = JSON.parse(match);
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const hash = await this.passwordService.hashPassword(newPassword);
    await this.userRepo.update(userId, { passwordHash: hash });
    await this.redis.delete(`reset:${token}`);
    return { message: "Password reset successfully" };
  }

  async verifyOtp(email: string, otp: string, type: string) {
    const stored = await this.redis.get(`${type}:${email}`);
    if (!stored) {
      throw new Error("OTP expired or not found");
    }

    const match = JSON.parse(stored);
    if (match.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    try {
      if (type === "signup") {
        const user = await this.userRepo.create({
          ...match,
          passwordHash: match.passwordHash,
        });

        if (!user) {
          throw new Error("User creation returned null/undefined");
        }

        await this.redis.delete(`signup:${email}`);

        const jwt = await this.accesToken.signAccessToken({
          userId: user.id,
          role: match.role,
        });

        return { user, accessToken: jwt };
      } else {
        // forgot-password or other OTP flows
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
          throw new Error("User not found for OTP verification");
        }

        //  temporary token
        const tempToken = await this.accesToken.signTempToken({ userId: user.id, type: "reset" });

        //  store in Redis
        await this.redis.set(`reset:${tempToken}`, JSON.stringify({ id: user.id }), 300);

        await this.redis.delete(`${type}:${email}`);

        return {
          message: "OTP verified",
          tempToken,
        };
      }
    } catch (err: any) {
      await this.redis.delete(`${type}:${email}`).catch(() => {
        console.warn(`Failed to remove OTP for ${email}`);
      });
      throw new Error(err.message || "Failed to verify OTP");
    }
  }

  async resendOtp(email: string, type: string) {
    if (type === "forgot") {
      const otp = this.OtpService.getOtp();
      await this.redis.set(`forgot:${email}`, JSON.stringify({ email, otp }), 60);
      //email
      await this.emailService.sendForgotPasswordOtp(email, otp);
    } else if (type === "signup") {
      const otp = this.OtpService.getOtp();
      await this.redis.set(`signup:${email}`, JSON.stringify({ email, otp }), 60);
      //email
      await this.emailService.sendSignupOtp(email, otp);
    }
    return { message: "otp sent" };
  }

  async googleSign(token: string) {
    try {
      const payload = await verifyGoogleToken(token);

      if (!payload) {
        throw new Error("Invalid Google token");
      }

      const { email, name = "No Name", emailVerified, sub } = payload;

      if (!email || !emailVerified) {
        throw new Error("Google account not verified");
      }

      let user = await this.userRepo.findByEmail(email);

      if (!user) {
        user = await this.userRepo.create({
          name,
          email,
          googleId: sub,
        });

        if (!user) {
          throw new Error("User creation failed");
        }
      }

      const jwt = await this.accesToken.signAccessToken({
        userId: user.id,
        role: user.role,
      });

      return { user, accessToken: jwt };
    } catch (err: any) {
      throw new Error(err.message || "Google sign-in failed");
    }
  }
}
