import { Request, Response, NextFunction } from "express";
import { IRefreshTokenService } from "@/common";
import { setTokens } from "../middleware/setToken";

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
      setTokens(res, result.access, result.refresh);

      return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      return next(error);
    }
  }
}
