import { IConversationParticipant } from "@/model/shared/conversation.participants";
import { IBaseRepo } from "@/repos/shared/base";

export interface IConversationParticipantRepo extends IBaseRepo<IConversationParticipant> {
  createTwoParticipants: (
    conversationId: string,
    learnerId: string,
    instructorId: string,
  ) => Promise<IConversationParticipant[] | null>;
  updateLastRead: (
    userId: string,
    conversationId: string,
  ) => Promise<IConversationParticipant | null>;
  findByUserAndConversation: (
    userId: string,
    conversationId: string,
  ) => Promise<IConversationParticipant | null>;
}
