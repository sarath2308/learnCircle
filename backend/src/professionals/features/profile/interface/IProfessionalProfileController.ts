import { NextFunction, Response } from "express";
import { ProfileRequest } from "../controller/profesional.profile.controller";

export interface IProfessionalProfileController {
  uploadProfile: (req: ProfileRequest, res: Response, next: NextFunction) => Promise<void>;
}
