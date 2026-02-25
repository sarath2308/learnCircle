import { Request, Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface IPaymentController {
  handleWebHook: (req: Request, res: Response) => Promise<void>;
  checkPaymentStatus: (req: IAuthRequest, res: Response) => Promise<void>;
}
