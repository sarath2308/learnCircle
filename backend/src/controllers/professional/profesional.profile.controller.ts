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
    @inject(TYPES.IProfessionalProfileService) private _service: IProfessionalProfileService,
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

    await this._service.uploadData(userId, req.body, {
      avatar: avatarStream,
      resume: resumeStream,
    });

    res.status(HttpStatus.CREATED).json({ message: Messages.PROFILE_UPDATED });
  }
}
