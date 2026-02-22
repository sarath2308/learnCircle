import { HttpStatus } from "@/constants/shared/httpStatus";
import { ILearnerProfessionalProfileController } from "@/interface/learner/learner.professional.profile.controller";
import { IProfessionalProfileService } from "@/interface/professional/professional.profile.service.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class LearnerProfessionalProfileController implements ILearnerProfessionalProfileController {
  constructor(
    @inject(TYPES.IProfessionalProfileService)
    private _professionalService: IProfessionalProfileService,
  ) {}

  async getAllProfiles(req: IAuthRequest, res: Response): Promise<void> {
    let { search, page } = req.query;
    let pageNum = Number(page) || 1;
    const profileData = await this._professionalService.getAllProfilesForUser(
      search as string,
      pageNum,
    );
    res.status(HttpStatus.OK).json({ success: true, profileData });
  }

  async getProfile(req: IAuthRequest, res: Response): Promise<void> {
    const instructorId = req.params.instructorId;
    const profileData = await this._professionalService.getProfessionalProfileForUser(instructorId);
    res.status(HttpStatus.OK).json({ success: true, profileData });
  }
}
