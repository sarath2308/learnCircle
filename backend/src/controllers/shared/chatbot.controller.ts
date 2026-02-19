import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { IChatBotController } from "@/interface/shared/chatbot/chatbot.controller.interface";
import { IChatBotService } from "@/interface/shared/chatbot/chatbot.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class ChatBotController implements IChatBotController {
  constructor(@inject(TYPES.IChatBotService) private _chatBotService: IChatBotService) {}

  async getReply(req: IAuthRequest, res: Response): Promise<void> {
    const message = req.body.message as string;
    const reply = await this._chatBotService.getReply(message);
    res.status(HttpStatus.OK).json({ success: true, reply });
  }
}
