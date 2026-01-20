import { Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface ICourseController {
  createCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  updatePrice: (req: IAuthRequest, res: Response) => Promise<void>;
  editCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  getCouseDataForCourseManagement: (req: IAuthRequest, res: Response) => Promise<void>;
  getCourseById: (req: IAuthRequest, res: Response) => Promise<void>;
  getCourseDataForCreatorView: (req: IAuthRequest, res: Response) => Promise<void>;
  publishCourse: (req: IAuthRequest, res: Response) => Promise<void>;
}
