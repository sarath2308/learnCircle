import { Request, Response, NextFunction } from "express";
import { IRefreshTokenService } from "@/services/shared/refreshToken.service";
import { setTokens } from "@/middleware";
import { AppError } from "@/errors/app.error";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";

export interface IRefreshController {
  refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}

export class RefreshController implements IRefreshController {
  constructor(private refreshService: IRefreshTokenService) {}

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const token: string = req.cookies?.refreshToken;
      if (!token) throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

      const result = await this.refreshService.refreshToken(token);
      setTokens(res, result.accessToken, result.refreshToken);

      return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      return next(error);
    }
  }
}
