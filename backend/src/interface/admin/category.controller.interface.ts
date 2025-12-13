import { Response } from "express";
import { IAuthRequest } from "../shared/auth/IAuthRequest";

export interface ICategoryController {
  createCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  updateCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  blockCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  unblockCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  listCategory: (req: IAuthRequest, res: Response) => Promise<void>;
}
