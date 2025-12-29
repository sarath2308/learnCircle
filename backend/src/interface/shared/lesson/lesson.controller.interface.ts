import { Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface ILessonController {
  createLesson(req: IAuthRequest, res: Response): Promise<void>;
  getLessonById(req: IAuthRequest, res: Response): Promise<void>;
  updateLesson(req: IAuthRequest, res: Response): Promise<void>;
  deleteLesson(req: IAuthRequest, res: Response): Promise<void>;
  changeLessonOrder(req: IAuthRequest, res: Response): Promise<void>;
  createLessonWithVideo(req: IAuthRequest, res: Response): Promise<void>;
}
