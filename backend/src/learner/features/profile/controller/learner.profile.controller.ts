import { AppError, TYPES } from "@/common";
import { inject, injectable } from "inversify";
import { Response, NextFunction } from "express";
import { HttpStatus } from "@/common";
import { Messages } from "@/common";
import { ILearnerProfileService } from "../interface/ILearnerProfileService";
import { ILearnerProfileController } from "../interface/ILearnerProfileController";
import { IAuthRequest } from "@/common/interface/IAuthRequest";

@injectable()
export class LearnerProfileController implements ILearnerProfileController {
  constructor(@inject(TYPES.ILearnerProfileService) private service: ILearnerProfileService) {}
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getProfile(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req?.user;
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }

      let response = await this.service.getProfile(userId);
      res
        .status(HttpStatus.OK)
        .json({ success: true, userData: response, message: Messages.PROFILE_FETCHED });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async updateProfilePhoto(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req?.user;
      let file = req?.avatar;
      if (!file) {
        throw new AppError(Messages.PROFILE_NOT_UPDATED, HttpStatus.BAD_REQUEST);
      }
      let result = await this.service.updateProfilePhoto(userId, {
        originalName: file?.originalname,
        mimeType: file?.mimetype,
        fileBuffer: file?.buffer,
      });
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: Messages.PROFILE_UPDATED, userData: result });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async requestEmailChangeOtp(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      let { userId } = req?.user;
      let { newEmail } = req.body;
      await this.service.requestEmailChangeOtp(userId, newEmail);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.OTP_SENT_SUCCESS });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async resendEmailChangeOtp(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      let { userId } = req?.user;
      await this.service.resendEmailChangeOtp(userId);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.OTP_SENT_SUCCESS });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async verifyEmailChangeOtp(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req?.user;
      const { otp } = req.body;
      let result = await this.service.verifyEmailChangeOtp(userId, otp);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: Messages.EMAIL_CHANGED, userData: result });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async updateName(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      let { userId } = req.user;
      let { name } = req.body;
      let result = await this.service.updateName(userId, name);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: Messages.PROFILE_UPDATED, userData: result });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async updatePassword(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req.user;
      const { password, newPassword } = req.body;
      const result = await this.service.updatePassword(userId, newPassword, password);
      res
        .status(HttpStatus.ACCEPTED)
        .json({ success: true, message: Messages.PROFILE_UPDATED, userData: result });
    } catch (error) {
      next(error);
    }
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getNewProfileUrl(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req.user;
      let result = await this.service.getProfileUrl(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.PROFILE_URL_GENERATED,
        profileUrl: result?.profileUrl,
      });
    } catch (error) {
      next(error);
    }
  }
}
