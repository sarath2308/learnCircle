import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import { Response } from "express";
import { ILearnerProfileService } from "@/interface/learner/ILearnerProfileService";
import { ILearnerProfileController } from "@/interface/learner/ILearnerProfileController";
import { IAuthRequest } from "@/interface/shared/auth/IAuthRequest";
import { AppError } from "@/errors/app.error";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { IProfileUploadRequest } from "@/interface/shared/profile.upload.request.interface";
import { Request } from "express";
@injectable()
export class LearnerProfileController implements ILearnerProfileController {
  constructor(
    @inject(TYPES.ILearnerProfileService) private _learnerProfileService: ILearnerProfileService,
  ) {}
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getProfile(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req?.user;
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    let response = await this._learnerProfileService.getProfile(userId);
    res
      .status(HttpStatus.OK)
      .json({ success: true, userData: response, message: Messages.PROFILE_FETCHED });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async updateProfilePhoto(
    req: Request & IAuthRequest & IProfileUploadRequest,
    res: Response,
  ): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req?.user;
    let file = req.avatar;
    if (!file) {
      throw new AppError(Messages.PROFILE_NOT_UPDATED, HttpStatus.BAD_REQUEST);
    }
    let result = await this._learnerProfileService.updateProfilePhoto(userId, {
      originalName: file?.originalname,
      mimeType: file?.mimetype,
      fileBuffer: file?.buffer,
    });
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: Messages.PROFILE_UPDATED, userData: result });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async requestEmailChangeOtp(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    let { userId } = req?.user;
    let { newEmail } = req.body;
    await this._learnerProfileService.requestEmailChangeOtp(userId, newEmail);
    res.status(HttpStatus.OK).json({ success: true, message: Messages.OTP_SENT_SUCCESS });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async resendEmailChangeOtp(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    let { userId } = req?.user;
    await this._learnerProfileService.resendEmailChangeOtp(userId);
    res.status(HttpStatus.OK).json({ success: true, message: Messages.OTP_SENT_SUCCESS });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async verifyEmailChangeOtp(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req?.user;
    const { otp } = req.body;
    let result = await this._learnerProfileService.verifyEmailChangeOtp(userId, otp);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: Messages.EMAIL_CHANGED, userData: result });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async updateName(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    let { userId } = req.user;
    let { name } = req.body;
    let result = await this._learnerProfileService.updateName(userId, name);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: Messages.PROFILE_UPDATED, userData: result });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async updatePassword(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req.user;
    const { password, newPassword } = req.body;
    const result = await this._learnerProfileService.updatePassword(userId, newPassword, password);
    res
      .status(HttpStatus.ACCEPTED)
      .json({ success: true, message: Messages.PROFILE_UPDATED, userData: result });
  }
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getNewProfileUrl(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.user?.userId) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req.user;
    let result = await this._learnerProfileService.getProfileUrl(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: Messages.PROFILE_URL_GENERATED,
      profileUrl: result?.profileUrl,
    });
  }
}
