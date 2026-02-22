import { Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface ICourseReviewController {
  createReview: (req: IAuthRequest, res: Response) => Promise<void>;
  editReview: (req: IAuthRequest, res: Response) => Promise<void>;
  removeReview: (req: IAuthRequest, res: Response) => Promise<void>;
  getAllReview: (req: IAuthRequest, res: Response) => Promise<void>;
}
