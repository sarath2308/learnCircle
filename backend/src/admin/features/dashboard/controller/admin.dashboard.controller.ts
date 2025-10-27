import { inject, injectable } from "inversify";
import { IAdminDashboardController } from "../interface/IAdminDashboardController";
import { IAuthRequest } from "@/common/interface/IAuthRequest";
import { NextFunction, Response } from "express";
import { TYPES } from "@/common/types/inversify/types";
import { IAdminDashboardService } from "../interface/IAdminDashboardService";
import { AppError, HttpStatus, Messages } from "@/common";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(@inject(TYPES.IAdminDashboardService) private _service: IAdminDashboardService) {}

  async getDashboard(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }

      res.status(HttpStatus.OK).json({ success: true, message: Messages.DASHBOARD_FETCHED });
    } catch (err) {
      next(err);
    }
  }
}
