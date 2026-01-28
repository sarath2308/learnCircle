import { IConversationParticipant } from "@/model/shared/conversation.participants";
import { BaseRepo } from "./base";
import { IConversationParticipantRepo } from "@/interface/shared/conversation/conversation.participant.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/shared/inversify/types";
import { Model } from "mongoose";

@injectable()
export class ConversationParticipantRepo
  extends BaseRepo<IConversationParticipant>
  implements IConversationParticipantRepo
{
  constructor(
    @inject(TYPES.IConversationParticipant)
    private _conversationParticipantModel: Model<IConversationParticipant>,
  ) {
    super(_conversationParticipantModel);
  }
  async createTwoParticipants(
    conversationId: string,
    learnerId: string,
    instructorId: string,
  ): Promise<IConversationParticipant[]> {
    const docs = await this._conversationParticipantModel.insertMany([
      {
        conversationId,
        userId: learnerId,
        lastReadAt: new Date(),
      },
      {
        conversationId,
        userId: instructorId,
        lastReadAt: new Date(),
      },
    ]);
    return docs as unknown as IConversationParticipant[];
  }
  async updateLastRead(
    userId: string,
    conversationId: string,
  ): Promise<IConversationParticipant | null> {
    return await this._conversationParticipantModel.findOneAndUpdate(
      {
        userId,
        conversationId,
      },
      {
        $set: { lastReadAt: new Date() },
      },
      {
        new: true,
      },
    );
  }

  async findByUserAndConversation(
    userId: string,
    conversationId: string,
  ): Promise<IConversationParticipant | null> {
    return await this._conversationParticipantModel.findOne({ userId, conversationId });
  }
}
