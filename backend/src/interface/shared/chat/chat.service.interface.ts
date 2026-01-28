import { ConversationResponseType } from "@/schema/shared/conversation/conversation.response.schema";
import { MessageResponseType } from "@/schema/shared/message/message.response.schema";

export interface IChatService {
  getOrCreateConversation(userId: string, courseId: string): Promise<ConversationResponseType>;
  getMessages(userId: string, conversationId: string): Promise<MessageResponseType[]>;
  sendMessage(
    senderId: string,
    conversationId: string,
    content: string,
  ): Promise<MessageResponseType>;
  getAllConversation: (userId: string) => Promise<ConversationResponseType[]>;
}
