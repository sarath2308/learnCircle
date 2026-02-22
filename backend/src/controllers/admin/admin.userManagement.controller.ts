import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { Response } from "express";
import { IAdminUserManagementController } from "@/interface/admin/admin.userManagement.controller.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { IAdminUserManagementService } from "@/interface/admin/admin.userManagement.service.interface";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
@injectable()
export class AdminUserManagementController implements IAdminUserManagementController {
  constructor(
    @inject(TYPES.IAdminUserManagementService) private _service: IAdminUserManagementService,
  ) {}
  async getLearnerData(req: IAuthRequest, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const search = String(req.query.search || "");
    let response = await this._service.getLearnerData(page, search);
    res.status(HttpStatus.OK).json({
      success: true,
      message: Messages.USER_MANAGEMENT_FETCHED,
      data: response.data,
      totalCount: response.totalCount,
    });
  }
  async getProfessionalData(req: IAuthRequest, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const search = String(req.query.search || "");
    let response = await this._service.getProfessionalData(page, search);
    res.status(HttpStatus.OK).json({
      success: true,
      message: Messages.USER_MANAGEMENT_FETCHED,
      data: response.data,
      totalCount: response.totalCount,
    });
  }
  async blockUser(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req.body;
    await this._service.blockUser(userId);
    res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_BLOCKED });
  }
  async unblockUser(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req.body;
    await this._service.unblockUser(userId);
    res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_UNBLOCKED });
  }

  async approveUser(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req.body;
    await this._service.approveUser(userId);
    res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_APPROVED });
  }

  async rejectUser(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req.body;
    await this._service.rejectUser(userId, "you need atleast 1 year expirience");
    res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_REJECTED });
  }
}
