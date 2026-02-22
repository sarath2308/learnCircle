import { Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface IChatController {
  getOrCreateConversation: (req: IAuthRequest, res: Response) => Promise<void>;
  getMessages: (req: IAuthRequest, res: Response) => Promise<void>;
  getAllConversation: (req: IAuthRequest, res: Response) => Promise<void>;
}
