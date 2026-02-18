import { Response } from "express";
import { IAuthRequest } from "../auth/auth.request.interface";

export interface IChatBotController
{
    getReply:(req: IAuthRequest, res: Response) => Promise<void>;
}