import { Response } from "express";
import { IAuthRequest } from "../shared/auth/auth.request.interface";

export interface ILearnerProfessionalProfileController {
  getAllProfiles: (req: IAuthRequest, res: Response) => Promise<void>;
  getProfile?: (req: IAuthRequest, res: Response) => Promise<void>;
}
