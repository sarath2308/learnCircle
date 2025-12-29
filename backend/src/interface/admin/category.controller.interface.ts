import { Response } from "express";
import { IAuthRequest } from "../shared/auth/auth.request.interface";

export interface ICategoryController {
  createCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  updateCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  blockCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  unblockCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  listCategoryForAdmin: (req: IAuthRequest, res: Response) => Promise<void>;
  getCategoryForUser: (req: IAuthRequest, res: Response) => Promise<void>;
}
