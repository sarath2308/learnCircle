import { IMessage } from "@/model/shared/messages";
import { IBaseRepo } from "@/repos/shared/base";

export interface IMessageRepo extends IBaseRepo<IMessage> {
  getMessagesFromConversation: (conversationId: string) => Promise<IMessage[] | []>;
}
