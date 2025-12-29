import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { NextFunction, Response } from "express";

export interface IAdminUserManagementController {
  getLearnerData: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  getProfessionalData: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  blockUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  unblockUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  approveUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  rejectUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
