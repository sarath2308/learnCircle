import { Response } from "express";
import { IAuthRequest } from "../shared/auth/auth.request.interface";

export interface ILearnerCourseController {
  getCourseForLearner: (req: IAuthRequest, res: Response) => Promise<void>;
}
