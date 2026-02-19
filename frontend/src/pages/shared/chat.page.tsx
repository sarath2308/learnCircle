import ChatComponent from "@/components/shared/chat.component";
import ConversationListComponent from "@/components/shared/conversation.list.component";
import { useState } from "react";

const ChatPage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleConversation = (convId: string) => {
    setConversationId(convId);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-slate-950 overflow-hidden">
      {/* List Sidebar */}
      <div className="w-[350px] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800">
        <ConversationListComponent
          openChat={handleConversation}
          activeConversationId={conversationId}
        />
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 p-6">
        {conversationId && (
          <ChatComponent
            conversationId={conversationId}
            title={conversationId ? `Conversation: ${conversationId.slice(0, 8)}...` : ""}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
