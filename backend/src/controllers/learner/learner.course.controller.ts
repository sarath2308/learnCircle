import { HttpStatus } from "@/constants/shared/httpStatus";
import { ILearnerCourseController } from "@/interface/learner/learner.course.controller.interface";
import { ILearnerCourseService } from "@/interface/learner/learner.course.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class LearnerCourseController implements ILearnerCourseController {
  constructor(
    @inject(TYPES.ILearnerCourseService) private _learnerCourseService: ILearnerCourseService,
  ) {}

  async getCourseForLearner(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const courseId = req.params.courseId as string;
    const courseData = await this._learnerCourseService.getCourseData(courseId, userId);
    res.status(HttpStatus.OK).json({ success: true, courseData });
  }

  async getAllCourseDataForUser(req: IAuthRequest, res: Response): Promise<void> {
    const courseData = await this._learnerCourseService.getAllCourseData(req.query);
    res.status(HttpStatus.OK).json({ success: true, courseData });
  }
}
