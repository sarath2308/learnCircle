import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ICourseController } from "@/interface/shared/course.controller.interface";
import { IAuthRequest } from "@/interface/shared/IAuthRequest";
import ICourseService from "@/interface/shared/ICourseService";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class CourseController implements ICourseController {
  constructor(@inject(TYPES.ICourseService) private _courseService: ICourseService) {}

  /*
  create course from the step1 api call from frontend
  service --> compress --> store
  */
  async createCourse(req: IAuthRequest, res: Response): Promise<void> {
    if (!req.files || !req.files.thumbnail) {
      throw new AppError(Messages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
    const thumbnail = req.files.thumbnail;
    let result = await this._courseService.createCourse(req.body, thumbnail);
    res.status(HttpStatus.CREATED).json({ success: true, courseId: result.courseId });
  }

  //update price details
  async updatePrice(req: IAuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    await this._courseService.updatePriceDetails(id, req.body);
    res.status(HttpStatus.OK).json({ success: true });
  }
}
