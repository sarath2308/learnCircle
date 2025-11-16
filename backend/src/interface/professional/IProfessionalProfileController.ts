import { NextFunction, Response } from "express";
import { ProfileRequest } from "@/types/professional/profile.request";

export interface IProfessionalProfileController {
  uploadProfile: (req: ProfileRequest, res: Response, next: NextFunction) => Promise<void>;
}
