import { Response } from "express";
import { IAuthRequest } from "../../auth/auth.request.interface";

export interface ISessionBookingController {
  bookSession: (req: IAuthRequest, res: Response) => Promise<void>;
  cancelBooking?: (req: IAuthRequest, res: Response) => Promise<void>;
  confirmBooking?: (req: IAuthRequest, res: Response) => Promise<void>;
  getAllBookingForUser?: (req: IAuthRequest, res: Response) => Promise<void>;
  getAllBoookingForInstructor?: (req: IAuthRequest, res: Response) => Promise<void>;
}
