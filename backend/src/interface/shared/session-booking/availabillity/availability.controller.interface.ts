import { Response } from "express";
import { IAuthRequest } from "../../auth/auth.request.interface";

export interface IAvailabilityController {
  createAvailability: (req: IAuthRequest, res: Response) => Promise<void>;
  updateAvailability: (req: IAuthRequest, res: Response) => Promise<void>;
  removeAvailability: (req: IAuthRequest, res: Response) => Promise<void>;
  getAllAvailabilityRules: (req: IAuthRequest, res: Response) => Promise<void>;
  getAllAvailabilityOfInstructor: (req: IAuthRequest, res: Response) => Promise<void>;
}
