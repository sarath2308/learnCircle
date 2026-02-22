import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { NextFunction, Response } from "express";

export interface IProfessionalDashboardController {
  getDashboard: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
