import { IAuthRequest } from "@/common/interface/IAuthRequest";
import { NextFunction, Response } from "express";

export interface IProfessionalDashboardController {
  getDashboard: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
