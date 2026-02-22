import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { Response } from "express";

export interface ILearnerProfileController {
  getProfile: (req: IAuthRequest, res: Response) => Promise<void>;

  updateProfilePhoto: (req: IAuthRequest, res: Response) => Promise<void>;

  requestEmailChangeOtp: (req: IAuthRequest, res: Response) => Promise<void>;

  resendEmailChangeOtp: (req: IAuthRequest, res: Response) => Promise<void>;

  verifyEmailChangeOtp: (req: IAuthRequest, res: Response) => Promise<void>;

  updateName: (req: IAuthRequest, res: Response) => Promise<void>;

  updatePassword: (req: IAuthRequest, res: Response) => Promise<void>;

  getNewProfileUrl: (req: IAuthRequest, res: Response) => Promise<void>;

  logout: (req: IAuthRequest, res: Response) => Promise<void>;
}
