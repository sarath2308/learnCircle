import { IAuthRequest } from "@/interface/shared/IAuthRequest";
import { NextFunction } from "express";
import { Response } from "express";

export interface ILearnerProfileController {
  getProfile: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;

  updateProfilePhoto: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;

  requestEmailChangeOtp: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;

  resendEmailChangeOtp: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;

  verifyEmailChangeOtp: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;

  updateName: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;

  updatePassword: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;

  getNewProfileUrl: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
