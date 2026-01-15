import { HttpStatus } from "@/constants/shared/httpStatus";
import { Messages } from "@/constants/shared/messages";
import { AppError } from "@/errors/app.error";
import { ICourseController } from "@/interface/shared/course/course.controller.interface";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import ICourseService from "@/interface/shared/course/course.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";
import { CourseStatus } from "@/interface/shared/course/course.repo.interface";

@injectable()
export class CourseController implements ICourseController {
  constructor(@inject(TYPES.ICourseService) private _courseService: ICourseService) {}

  /*
  create course from the step1 api call from frontend
  service --> compress --> store
  */
  async createCourse(req: IAuthRequest, res: Response): Promise<void> {
    console.log("FILES:", req.files);

    if (!req.files || !req.files["thumbnail"]) {
      throw new AppError(Messages.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
    req.body.createdBy = req.user?.userId;
    const thumbnail = req.files["thumbnail"];
    let result = await this._courseService.createCourse(req.body, thumbnail);
    res.status(HttpStatus.CREATED).json({ success: true, courseId: result.courseId });
  }

  //update price details
  async updatePrice(req: IAuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    await this._courseService.updatePriceDetails(id, req.body);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async getCouseDataForCourseManagement(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    // ?status=draft | ?status=published | no param
    const status = req.query.status as CourseStatus | undefined;

    const courseData = await this._courseService.getCouseDataForCourseManagement(userId, status);
    res.status(HttpStatus.OK).json({ success: true, courseData });
  }

  async getCourseById(req: IAuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const courseData = await this._courseService.getCourseById(id);
    res.status(HttpStatus.OK).json({ success: true, courseData });
  }

  async getCourseDataForCreatorView(req: IAuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const courseData = await this._courseService.getCourseDataForCreatorView(id);
    res.status(HttpStatus.OK).json({ success: true, courseData });
  }

  async publishCourse(req: IAuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    await this._courseService.publishCourse(id);
    res.status(HttpStatus.OK).json({ success: true });
  }
}
