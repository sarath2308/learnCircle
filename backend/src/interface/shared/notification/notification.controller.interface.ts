import { Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface INotificationController {
  getUserNotification: (req: IAuthRequest, res: Response) => Promise<void>;
  markAllTheNotificationRead: (req: IAuthRequest, res: Response) => Promise<void>;
  markNotificationRead?: (req: IAuthRequest, res: Response) => Promise<void>;
}
