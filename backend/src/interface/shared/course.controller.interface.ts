import { Response } from "express";
import { IAuthRequest } from "./IAuthRequest";

export interface ICourseController {
  createCourse: (req: IAuthRequest, res: Response) => Promise<void>;
  updatePrice: (req: IAuthRequest, res: Response) => Promise<void>;
}
