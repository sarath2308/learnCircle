import { Response } from "express";
import { ProfileRequest } from "@/types/professional/profile.request";

export interface IProfessionalProfileController {
  uploadProfile: (req: ProfileRequest, res: Response) => Promise<void>;
  updateProfile: (req: ProfileRequest, res: Response) => Promise<void>;
  getProfile: (req: ProfileRequest, res: Response) => Promise<void>;
  updatePassword: (req: ProfileRequest, res: Response) => Promise<void>;
  updateProfileImage: (req: ProfileRequest, res: Response) => Promise<void>;
  reqEmailOtp: (req: ProfileRequest, res: Response) => Promise<void>;
  verifyAndUpdateEmail: (req: ProfileRequest, res: Response) => Promise<void>;
  logOut: (req: ProfileRequest, res: Response) => Promise<void>;
}
