import { TYPES } from "@/common";
import { inject, injectable } from "inversify";
import { HttpStatus } from "@/common";
import { Messages } from "@/common";
import { ILearnerHomeController } from "../interface/ILearnerHomeController";
import { IAuthRequest } from "@/common/interface/IAuthRequest";
import { ILearnerHomeService } from "../interface/ILearnerHomeService";
import { NextFunction, Response } from "express";

@injectable()
export class LearnerHomeController implements ILearnerHomeController {
  constructor(@inject(TYPES.ILearnerHomeService) private service: ILearnerHomeService) {}

  async getHome(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      res.status(HttpStatus.OK).json({ success: true, message: Messages.HOME_RENDERED });
    } catch (error) {
      next(error);
    }
  }
}
