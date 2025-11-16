import { NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { IProfessionalProfileService } from "@/interface/professional/IProfessionalProfileService";
import { IProfessionalProfileController } from "@/interface/professional/IProfessionalProfileController";
import { AppError } from "@/errors/app.error";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { ProfileRequest } from "@/types/professional/profile.request";

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
