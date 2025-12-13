import { IAuthRequest } from "@/interface/shared/auth/IAuthRequest";
import { NextFunction, Response } from "express";

export interface IAdminDashboardController {
  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  getDashboard: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
