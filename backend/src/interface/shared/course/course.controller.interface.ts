import { Response } from "express";
import { IAuthRequest } from "./auth/IAuthRequest";

export interface ICourseController {
  createCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  updatePrice: (req: IAuthRequest, res: Response) => Promise<void>;
}
