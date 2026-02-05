import { Response } from "express";
import { IAuthRequest } from "../../auth/auth.request.interface";

export interface IAvailabilityExceptionController {
  createException: (req: IAuthRequest, res: Response) => Promise<void>;
  removeException: (req: IAuthRequest, res: Response) => Promise<void>;
  listException?: (req: IAuthRequest, res: Response) => Promise<void>;
}
