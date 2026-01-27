import { HttpStatus } from "@/constants/shared/httpStatus";
import { IAuthRequest } from "@/interface/shared/auth/auth.request.interface";
import { IChatController } from "@/interface/shared/chat/chat.controller.interface";
import { IChatService } from "@/interface/shared/chat/chat.service.interface";
import { TYPES } from "@/types/shared/inversify/types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.IChatService) private _chatService: IChatService) {}

  async getOrCreateConversation(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const courseId = req.params.courseId as string;

    const conversationData = await this._chatService.getOrCreateConversation(userId, courseId);
    res.status(HttpStatus.OK).json({ success: true, conversationData });
  }
  async getMessages(req: IAuthRequest, res: Response): Promise<void> {
    const userId = req.user?.userId as string;
    const conversationId = req.params.conversationId as string;
    const messageData = await this._chatService.getMessages(userId, conversationId);
    res.status(HttpStatus.OK).json({ success: true, messageData });
  }
}
