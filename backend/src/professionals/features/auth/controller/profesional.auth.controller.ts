import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@/common";
import { ProfesionalAuthService } from "@/professionals";
import { timeStringToMs } from "@/common"; // make sure this exists
import { AuthConfig } from "@/config/authConfig";
import { HttpStatus } from "@/common";
import { Messages } from "@/common";
@injectable()
export class ProfesionalAuthController {
  constructor(
    @inject(TYPES.ProfesionalAuthService)
    private profesionalService: ProfesionalAuthService,
  ) {}

  // Helper to set accessToken cookie
  private setAccessTokenCookie(res: Response, token: string) {
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: timeStringToMs(AuthConfig.accessTokenExpiresIn),
    });
  }

  async signup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }

      const response = await this.profesionalService.signup(name, email, password);
      return res.status(HttpStatus.OK).json(response?.user);
    } catch (error: any) {
      console.error(error);

      if (error.message === "already exist" || error.message === "duplicate_error") {
        return res
          .status(HttpStatus.SERVICE_UNAVAILABLE)
          .json({ message: "Email already exists. Please login." });
      }

      return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    const { email, otp, type } = req.body;
    if (!email || !otp) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Email and OTP are required" });
    }

    try {
      const result = await this.profesionalService.verifyOtp(email, otp, type);

      if (type === "forgot") {
        return res.status(HttpStatus.OK).json({ message: result.message, token: result.tempToken });
      } else {
        this.setAccessTokenCookie(res, result.accessToken);
        return res.status(200).json({ user: result.user });
      }
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "OTP verification failed" });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const result = await this.profesionalService.login(email, password);
      this.setAccessTokenCookie(res, result.accessToken);
      return res.status(200).json({ user: result.user });
    } catch (error: any) {
      console.error(error);
      return res.status(401).json({ message: error.message || "Login failed" });
    }
  }

  async getOtp(req: Request, res: Response): Promise<Response> {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ message: "Email and type are required" });
    }

    try {
      if (type === "forgot") {
        await this.profesionalService.forgotPassword(email);
      }
      return res.status(200).json({ message: "OTP sent successfully." });
    } catch (error: any) {
      console.error(error);
      return res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json({ message: error.message || "Failed to send OTP. Please try again" });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Token and new password are required" });
      }

      await this.profesionalService.resetPassword(token, newPassword);
      return res.status(HttpStatus.OK).json({ message: "Password changed successfully" });
    } catch (error: any) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    res.clearCookie("accessToken");
    return res.status(HttpStatus.OK).json({ message: "Logged out successfully" });
  }

  async resendOtp(req: Request, res: Response): Promise<Response> {
    const { email, type } = req.body;
    if (!email || !type) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Email and type are required" });
    }

    try {
      await this.profesionalService.resendOtp(email, type);
      return res.status(HttpStatus.OK).json({ message: "OTP sent successfully." });
    } catch (error: any) {
      console.error(error);
      return res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json({ message: error.message || "Failed to send OTP. Please try again" });
    }
  }

  async googleSign(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Token missing" });
      }

      const result = await this.profesionalService.googleSign(token);
      this.setAccessTokenCookie(res, result.accessToken);
      return res.status(200).json({ user: result.user });
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  }
}
