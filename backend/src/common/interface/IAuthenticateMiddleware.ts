import { IAuthRequest } from "../middleware";
import { Response, NextFunction } from "express";

export interface IAuthenticateMiddleware {
  handle: (req: IAuthRequest, res: Response, next: NextFunction) => void;
}
