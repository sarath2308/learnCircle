import { IAuthRequest } from "@/interface/shared/IAuthRequest";
import { NextFunction, Response } from "express";

export interface ILearnerHomeController {
  getHome: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
