import { injectable, inject } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { IProfessionalProfileService } from "@/interface/professional/professional.profile.service.interface";
import { IProfessionalProfileController } from "@/interface/professional/professional.profile.controller.interface";
import { AppError } from "@/errors/app.error";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { ProfileRequest } from "@/types/professional/profile.request";

@injectable()
export class ProfessionalProfileController implements IProfessionalProfileController {
  constructor(
    @inject(TYPES.IProfessionalProfileService) private _profileService: IProfessionalProfileService,
  ) {}

  async uploadProfile(req: ProfileRequest, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
    const { userId } = req.user;
    if (!req.files || (!req.files["avatar"] && !req.files["resume"])) {
      res.status(400).json({ message: "Avatar or resume file is required." });
      return;
    }

    const avatarStream = req.files["avatar"];
    const resumeStream = req.files["resume"];

    await this._profileService.uploadData(userId, req.body, {
      avatar: avatarStream,
      resume: resumeStream,
    });

    res.status(HttpStatus.CREATED).json({ message: Messages.PROFILE_UPDATED });
  }

  async updateProfile(req: ProfileRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    await this._profileService.updateProfile(userId, req.body);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async getProfile(req: ProfileRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const profileData = await this._profileService.getProfessionalProfileForUser(userId);
    res.status(HttpStatus.OK).json({ success: true, profileData });
  }

  async updatePassword(req: ProfileRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const newPassword = req.body.newPassword as string;
    const oldPassword = req.body.oldPassword as string;
    await this._profileService.updatePassword(userId, oldPassword, newPassword);
    res.status(HttpStatus.OK).json({ success: true });
  }
  async updateProfileImage(req: ProfileRequest, res: Response): Promise<void> {
    if (!req.files || !req.files["avatar"]) {
      throw new AppError(Messages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
    const userId = req.user?.userId as string;
    const profileImg = req.files["avatar"];
    await this._profileService.updateProfilePicture(userId, profileImg);
    res.status(HttpStatus.OK).json({ success: true });
  }
  async logOut(req: ProfileRequest, res: Response): Promise<void> {
    const jti = req.user?.jti as string;
    const userId = req.user?.userId as string;
    await this._profileService.logout(userId, jti);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async reqEmailOtp(req: ProfileRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    await this._profileService.requestChangeEmail(userId, req.body.newEmail);
    res.status(HttpStatus.OK).json({ success: true });
  }
  async verifyAndUpdateEmail(req: ProfileRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    await this._profileService.verifyAndUpdateEmail(userId, req.body.otp);
    res.status(HttpStatus.OK).json({ success: true });
  }
}
