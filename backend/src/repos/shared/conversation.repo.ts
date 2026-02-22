import { IConversationRepo } from "@/interface/shared/conversation/conversation.repo.interface";
import { BaseRepo } from "./base";
import { IConversation } from "@/model/shared/conversation.model";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";

@injectable()
export class ConversationRepo extends BaseRepo<IConversation> implements IConversationRepo {
  constructor(@inject(TYPES.IConversation) private _conversationModel: Model<IConversation>) {
    super(_conversationModel);
  }

  async findConversationForUser(courseId: string, userId: string): Promise<IConversation | null> {
    return await this._conversationModel.findOne({
      courseId,
      $or: [{ learnerId: userId }, { instructorId: userId }],
    });
  }

  async findAllConversationForUser(userId: string): Promise<IConversation[] | []> {
    return await this._conversationModel.find({
      $or: [{ learnerId: userId }, { instructorId: userId }],
    });
  }
}
