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
    const page = req.query.page;
    const limit = req.query.limit;
    const courseData = await this._courseManagementService.getAllCourseData(
      Number(page),
      Number(limit),
    );
    res.status(HttpStatus.OK).json({ success: true, courseData });
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
    await this._courseManagementService.rejectCourse(courseId, req.body);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async blockCourse(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId;
    await this._courseManagementService.blockCourse(courseId, req.body);
    res.status(HttpStatus.OK).json({ success: true });
  }

  async unblock(req: IAuthRequest, res: Response): Promise<void> {
    const courseId = req.params.courseId;
    await this._courseManagementService.unblockCourse(courseId);
    res.status(HttpStatus.OK).json({ success: true });
  }
}
