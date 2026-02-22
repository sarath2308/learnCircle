import { IConversation } from "@/model/shared/conversation.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface IConversationRepo extends IBaseRepo<IConversation> {
  findConversationForUser: (courseId: string, userId: string) => Promise<IConversation | null>;
  findAllConversationForUser: (userId: string) => Promise<IConversation[] | []>;
}
