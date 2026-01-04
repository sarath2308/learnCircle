import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAdminCourseManagementService } from "@/interface/admin/admin.course.manage.interface";
import { IAdminCourseManagementController } from "@/interface/admin/admin.course.management.controller";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";
import { success } from "zod";
@injectable()
export class AdminCourseManagementController implements IAdminCourseManagementController
{
    constructor(@inject(TYPES.IAdminCourseManagementService) private _courseManagementService: IAdminCourseManagementService){}

    async getAllCourse(req: IAuthRequest, res: Response):Promise<void>
    {
       const page = req.query.page;
       const limit =  req.query.limit;
      const courseData = await this._courseManagementService.getAllCourseData(Number(page),Number(limit))
      res.status(HttpStatus.OK).json({ success: true, courseData});
    }
    async getCourseData(req: IAuthRequest, res: Response): Promise<void>
    {

    }
    async approveCourse(req: IAuthRequest, res: Response): Promise<void>
    {

    }
    async rejectCourse(req: IAuthRequest, res: Response): Promise<void>
    {

    }
    async blockCourse(req: IAuthRequest, res: Response): Promise<void>
    {

    }
    async unblock(req: IAuthRequest, res: Response): Promise<void>
    {

    }
}