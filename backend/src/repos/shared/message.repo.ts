import { IMessageRepo } from "@/interface/shared/messages/message.repo.interface";
import { BaseRepo } from "./base";
import { IMessage } from "@/model/shared/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";
@injectable()
export class MessageRepo extends BaseRepo<IMessage> implements IMessageRepo {
  constructor(@inject(TYPES.IMessage) private _messageModel: Model<IMessage>) {
    super(_messageModel);
  }
  async getMessagesFromConversation(conversationId: string): Promise<IMessage[] | []> {
    return await this._messageModel.find({ conversationId });
  }
}
