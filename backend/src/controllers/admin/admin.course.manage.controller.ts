import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAdminCourseManagementService } from "@/interface/admin/admin.course.manage.interface";
import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AdminCourseManagementController implements IAdminCourseManagementController {
  constructor(
    @inject(TYPES.IAdminCourseManagementService)
    private _courseManagementService: IAdminCourseManagementService,
  ) {}

  async getAllCourse(req: IAuthRequest, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { courseData, TotalCourseCount } = await this._courseManagementService.getAllCourseData(
      page,
      limit,
    );
    res.status(HttpStatus.OK).json({ success: true, courseData, TotalCourseCount });
  }

  async getCourseData(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId;
    const courseData = await this._courseManagementService.getCourseDetails(courseId);
    res.status(HttpStatus.OK).json({ success: true, courseData });
  }

  async approveCourse(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId;
    await this._courseManagementService.approveCourse(courseId);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async rejectCourse(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId;
    await this._courseManagementService.rejectCourse(courseId, req.body?.reason);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async blockCourse(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId;
    await this._courseManagementService.blockCourse(courseId, req.body?.reason);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async unblock(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId;
    await this._courseManagementService.unblockCourse(courseId);
    res.status(HttpStatus.OK).json({ success: true });
  }
}
