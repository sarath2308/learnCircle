import { TYPES } from "@/types/shared/inversify/types";
import { inject, injectable } from "inversify";
import { ILearnerHomeController } from "@/interface/learner/learner.home.controller.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { ILearnerHomeService } from "@/interface/learner/learner.home.service.interface";
import { Messages } from "@/constants/shared/messages";
import { HttpStatus } from "@/constants/shared/httpStatus";
import { Response } from "express";

@injectable()
export class LearnerHomeController implements ILearnerHomeController {
  constructor(@inject(TYPES.ILearnerHomeService) private _lernerHomeService: ILearnerHomeService) {}

  async getHome(req: IAuthRequest, res: Response) {
    const userId = req.user?.userId!;
    const { categoryData, courseCardData } = await this._lernerHomeService.getHome(userId);
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: Messages.HOME_RENDERED, categoryData, courseCardData });
  }
}
