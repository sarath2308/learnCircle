import { inject, injectable } from "inversify";
import { IProfessionalDashboardController } from "../interfaces/IProfessionalDashboardController";
import { TYPES } from "@/common/types/inversify/types";
import { IProfessionalDashboardService } from "../interfaces/IProfessionalDashboard";
import { IAuthRequest } from "@/common/interface/IAuthRequest";
import { NextFunction, Response } from "express";
import { AppError, HttpStatus, Messages } from "@/common";
@injectable()
export class ProfessionalDashboardController implements IProfessionalDashboardController {
  constructor(
    @inject(TYPES.IProfessionalDashboardService) private _service: IProfessionalDashboardService,
  ) {}

  async getDashboard(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(Messages.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const { userId } = req.user;

      let result = await this._service.getDashboard(userId);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: Messages.DASHBOARD_FETCHED, userData: result });
    } catch (err) {
      next(err);
    }
  }
}
