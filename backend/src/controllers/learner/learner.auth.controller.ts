import { IAuthController } from "../../types/common/learnerAuthController";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { LearnerAuthService } from "../../services/learner/learnerAuthService";
import { TYPES } from "../../types/types";
import { setTokens } from "../../middleware/setToken";
export interface IResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}
@injectable()
export class LearnerAuthController implements IAuthController {
  constructor(@inject(TYPES.LearnerAuthService) private learnerAuth: LearnerAuthService) {}
  async signup(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        throw new Error("credential missing");
      }
      const response = await this.learnerAuth.signup(name, email, password);
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);

      if (error.message === "already exist" || error.message === "duplicate_error") {
        return res.status(409).json({ message: "Email already exists. Please login." });
      }

      return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    const { otp, email, type } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
      const result = await this.learnerAuth.verifyOtp(email, otp, type);

      if (type === "forgot") {
        return res.status(200).json({ message: result.message, token: result.tempToken });
      } else {
        setTokens(res, result.accessToken!, result.refreshToken);

        return res.status(200).json({ user: result.user });
      }
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "OTP verification failed" });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const result: IResponse = await this.learnerAuth.login(email, password);
      setTokens(res, result.accessToken, result.refreshToken);

      res.status(200).json({ user: result.user });
    } catch (error: any) {
      console.log(error);
      res.status(401).json({ message: error.message || "Login failed" });
    }
  }

  async getOtp(req: Request, res: Response): Promise<Response> {
    const { email, type } = req.body;
    try {
      if (type === "forgot") {
        const res = await this.learnerAuth.forgotPassword(email);
      }
      return res.status(200).json({ message: "OTP sent successfully." });
    } catch (error: any) {
      console.error(error);
      return res
        .status(401)
        .json({ message: error.message || "Failed to send OTP. Please try again" });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      await this.learnerAuth.resetPassword(token, newPassword);

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error: any) {
      return res.status(400).json({
        message: "Server error occurred",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    return res.json();
  }

  async resendOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { email, type } = req.body;
      await this.learnerAuth.resendOtp(email, type);
      return res.status(200).json({ message: "OTP sent successfully." });
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ message: error.message || "Failed to send OTP. Please try again" });
    }
  }

  async googleSign(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error("token missing");
      }
      const result: IResponse = await this.learnerAuth.googleSign(token);
      setTokens(res, result.accessToken, result.refreshToken);
      res.status(200).json({ user: result.user });
    } catch (error: any) {
      console.error("ithoke sradikande......", error);
      return res.status(400).json({ message: "something went wrong try after sometime" });
    }
  }
}
