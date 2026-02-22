import { Response } from "express";
import { IAuthRequest } from "../shared/auth/auth.request.interface";

export interface IProfessionalProfileController {
  uploadProfile: (req: IAuthRequest, res: Response) => Promise<void>;
  updateProfile: (req: IAuthRequest, res: Response) => Promise<void>;
  getProfile: (req: IAuthRequest, res: Response) => Promise<void>;
  updatePassword: (req: IAuthRequest, res: Response) => Promise<void>;
  updateProfileImage: (req: IAuthRequest, res: Response) => Promise<void>;
  reqEmailOtp: (req: IAuthRequest, res: Response) => Promise<void>;
  verifyAndUpdateEmail: (req: IAuthRequest, res: Response) => Promise<void>;
  logOut: (req: IAuthRequest, res: Response) => Promise<void>;
}
