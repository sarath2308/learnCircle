import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { HttpStatus } from "../constants/shared/httpStatus";
import { Messages } from "../constants/shared/messages";
import { Response, NextFunction } from "express";
export const authorizeRoles = (...roles: string[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role || "")) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: Messages.FORBIDDEN });
    }
    next();
  };
};
