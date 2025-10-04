import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import { TokenService } from "../../utils/token.jwt";

const tokenService = new TokenService();
export interface AuthRequest extends Request {
  user?: JwtPayload & { role?: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies["accessToken"];

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
  }

  try {
    const decoded = tokenService.verifyAccessToken(token);
    if (!decoded) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
  }
};
