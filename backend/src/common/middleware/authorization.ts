import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { ITokenService } from "@/common";
import { HttpStatus, Messages } from "../constants";
import { IAuthenticateMiddleware } from "../interface/IAuthenticateMiddleware";
import { TYPES } from "../types/inversify/types";

export interface IAuthRequest extends Request {
  user?: { userId: string; role: string };
}

@injectable()
export class AuthenticateMiddleware implements IAuthenticateMiddleware {
  constructor(@inject(TYPES.ITokenService) private _tokenService: ITokenService) {}

  async handle(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies["accessToken"];

    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: `${Messages.UNAUTHORIZED}:111111111` });
      return;
    }

    try {
      const decoded = (await this._tokenService.verifyAccessToken(token)) as {
        userId: string;
        role: string;
      };

      req.user = decoded;
      next();
    } catch (err: unknown) {
      console.error(err);
      // Narrow the error type
      const error = err as { name?: string };

      if (error.name === "TokenExpiredError") {
        // Token expired → frontend can call refresh
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: `${Messages.UNAUTHORIZED}:2222222222` });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: `${Messages.UNAUTHORIZED}:33333333` });
      }
    }
  }
}
