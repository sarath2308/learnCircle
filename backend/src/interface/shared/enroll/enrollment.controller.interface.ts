import { Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface IEnrollmentController {
  enroll: (req: IAuthRequest, res: Response) => Promise<void>;
}
