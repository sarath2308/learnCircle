import { IAuthRequest } from "@/common/interface/IAuthRequest";
import { Response, NextFunction } from "express";
import { IAdminUserManagementController } from "../interfaces/IAdminUserManagementController";
import { inject, injectable } from "inversify";
import { TYPES } from "@/common/types/inversify/types";
import { IAdminUserManagementService } from "../interfaces/IAdminUserManagementService";
import { AppError, HttpStatus, Messages } from "@/common";
@injectable()
export class AdminUserManagementController implements IAdminUserManagementController {
  constructor(
    @inject(TYPES.IAdminUserManagementService) private _service: IAdminUserManagementService,
  ) {}
  async getUserManagement(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let response = await this._service.getUserData();
      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.USER_MANAGEMENT_FETCHED,
        learnerData: response.learners,
        professionalData: response.professionals,
      });
    } catch (error) {
      next(error);
    }
  }
  async blockUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req.body;
      await this._service.blockUser(userId);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_BLOCKED });
    } catch (err) {
      next(err);
    }
  }
  async unblockUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req.body;
      await this._service.unblockUser(userId);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_UNBLOCKED });
    } catch (err) {
      next(err);
    }
  }

  async approveUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req.body;
      await this._service.approveUser(userId);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_APPROVED });
    } catch (error) {
      next(error);
    }
  }

  async rejectUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req.body;
      await this._service.rejectUser(userId, "you need atleast 1 year expirience");
      res.status(HttpStatus.OK).json({ success: true, message: Messages.USER_REJECTED });
    } catch (error) {
      next(error);
    }
  }
}
