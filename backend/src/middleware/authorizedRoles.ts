import { AuthRequest } from "./authorization";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import { Response, NextFunction } from "express";
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role || "")) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: Messages.FORBIDDEN });
    }
    next();
  };
};
