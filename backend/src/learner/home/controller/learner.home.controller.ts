import { Request, Response, NextFunction } from "express";
import { LearnerHomeService } from "../../services/learner/learner.home.service.ts";
import { TYPES } from "../../types/types";
import { inject, injectable } from "inversify";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messages";

@injectable()
export class LearnerHomeController {
  constructor(@inject(TYPES.LearnerHomeService) private service: LearnerHomeService) {}

  async getHome(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(HttpStatus.OK).json({ message: "Home rendered" });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
    }
  }
}
