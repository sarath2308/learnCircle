import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { ITokenService } from "@/utils";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthenticateMiddleware } from "@/interface/shared/IAuthenticateMiddleware";
import { TYPES } from "../types/shared/inversify/types";
import { Messages } from "@/constants/shared/messages";

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
