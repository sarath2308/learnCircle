import { Request, Response, NextFunction } from "express";
import IRefreshTokenService from "../services/refreshToken.service";
import { AuthConfig } from "../config/authConfig";
import { timeStringToMs } from "../utils/timeString";

export interface IRefreshController {
  refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}

export class RefreshController implements IRefreshController {
  constructor(private refreshService: IRefreshTokenService) {}

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const token: string = req.cookies?.refreshToken;
      if (!token) throw new Error("Refresh token missing");

      const result = await this.refreshService.refreshToken(token);

      res.cookie("accessToken", result.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: timeStringToMs(AuthConfig.accessTokenExpiresIn),
      });

      res.cookie("refreshToken", result.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: timeStringToMs(AuthConfig.refreshTokenExpiresIn),
      });

      return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      return next(error);
    }
  }
}
