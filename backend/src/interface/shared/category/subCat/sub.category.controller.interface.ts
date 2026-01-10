import { Response } from "express";
import { IAuthRequest } from "../../auth/auth.request.interface";

export interface ISubCategoryController {
  createSubCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  updateSubCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  blockSubCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  unblockSubCategory: (req: IAuthRequest, res: Response) => Promise<void>;
  listSubCategoryForAdmin: (req: IAuthRequest, res: Response) => Promise<void>;
  getSubCategoryForUser: (req: IAuthRequest, res: Response) => Promise<void>;
}
