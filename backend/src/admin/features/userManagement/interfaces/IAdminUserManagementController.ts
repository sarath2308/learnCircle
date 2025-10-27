import { IAuthRequest } from "@/common/interface/IAuthRequest";
import { NextFunction, Response } from "express";

export interface IAdminUserManagementController {
  getUserManagement: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  blockUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  unblockUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  approveUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
  rejectUser: (req: IAuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
