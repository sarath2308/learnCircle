import { Response } from "express";
import { IAuthRequest } from "../shared/auth/auth.request.interface";

export interface IAdminCourseManagementController {
  getAllCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  approveCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  rejectCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  blockCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  unblock: (req: IAuthRequest, res: Response) => Promise<void>;
}
