import { NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@/common/types/inversify/types";
import { Response } from "express";
import { AppError, HttpStatus } from "@/common";
import { Messages } from "@/common";
import { IProfessionalProfileService } from "../interface/IProfessionalProfileService";
import { IAuthRequest } from "@/common/interface/IAuthRequest";
import { IProfessionalProfileController } from "../interface/IProfessionalProfileController";
export interface ProfileRequest extends IAuthRequest {
  avatar?: Express.Multer.File;
  resume?: Express.Multer.File;
}
@injectable()
export class ProfessionalProfileController implements IProfessionalProfileController {
  constructor(
    @inject(TYPES.IProfessionalProfileService) private _service: IProfessionalProfileService,
  ) {}

  async uploadProfile(req: ProfileRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
      }
      const { userId } = req.user;

      if (!req.avatar && !req.resume) {
        res.status(400).json({ message: "Avatar or resume file is required." });
      }

      const avatarBuffer = req.avatar?.buffer;
      const resumeBuffer = req.resume?.buffer;

      await this._service.uploadData(userId, req.body, {
        avatar: {
          buffer: avatarBuffer,
          mimeType: req.avatar?.mimetype,
          originalName: req.avatar?.originalname,
        },
        resume: {
          buffer: resumeBuffer,
          mimeType: req.resume?.mimetype,
          originalName: req.resume?.originalname,
        },
      });

      res.status(HttpStatus.CREATED).json({ message: Messages.PROFILE_UPDATED });
    } catch (error) {
      next(error);
    }
  }
}
