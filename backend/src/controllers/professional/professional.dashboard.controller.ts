import { inject, injectable } from "inversify";
import { IProfessionalDashboardController } from "@/interface/professional/professional.dashboard.controller.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { IProfessionalDashboardService } from "@/interface/professional/professional.dashboard.service.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { Response } from "express";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
@injectable()
export class ProfessionalDashboardController implements IProfessionalDashboardController {
  constructor(
    @inject(TYPES.IProfessionalDashboardService) private _service: IProfessionalDashboardService,
  ) {}

  async getDashboard(req: IAuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError(Messages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const { userId } = req.user;

    let result = await this._service.getDashboard(userId);

    res
      .status(HttpStatus.OK)
      .json({ success: true, message: Messages.DASHBOARD_FETCHED, userData: result });
  }
}
