import { inject, injectable } from "inversify";
import { IAdminDashboardController } from "@/interface/admin/IAdminDashboardController";
import { IAuthRequest } from "@/interface/shared/auth/IAuthRequest";
import { Response } from "express";
import { TYPES } from "@/types/shared/inversify/types";
import { IAdminDashboardService } from "@/interface/admin/IAdminDashboardService";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(@inject(TYPES.IAdminDashboardService) private _service: IAdminDashboardService) {}

  async getDashboard(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    res.status(HttpStatus.OK).json({ success: true, message: Messages.DASHBOARD_FETCHED });
  }
}
