import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { ITokenService, TYPES } from "@/common";
import { HttpStatus, Messages } from "../constants";
import { IAuthenticateMiddleware } from "../interface/IAuthenticateMiddleware";

export interface IAuthRequest extends Request {
  user?: { userId: string; role: string };
}

@injectable()
export class AuthenticateMiddleware implements IAuthenticateMiddleware {
  constructor(@inject(TYPES.ITokenService) private _tokenService: ITokenService) {}

  handle(req: IAuthRequest, res: Response, next: NextFunction): void {
    const token = req.cookies["accessToken"];
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
      return;
    }

    try {
      const decoded = this._tokenService.verifyAccessToken(token) as {
        userId: string;
        role: string;
      };
      if (!decoded) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
        return;
      }

      req.user = decoded;
      next();
    } catch {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
    }
  }
}
