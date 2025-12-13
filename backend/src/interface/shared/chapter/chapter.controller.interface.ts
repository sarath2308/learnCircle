import { Response } from "express";
import { IAuthRequest } from "../auth/IAuthRequest";

export interface IChapterController {
  createChapter: (req: IAuthRequest, res: Response) => Promise<void>;
  editChapter: (req: IAuthRequest, res: Response) => Promise<void>;
  removeChapter: (req: IAuthRequest, res: Response) => Promise<void>;
}
