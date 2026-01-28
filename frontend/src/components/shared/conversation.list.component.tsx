import { useGetAllConversation } from "@/hooks/shared/chat/conversation.get.all.hook";

interface ListProps {
  openChat: (conversationId: string) => void;
  activeConversationId: string | null;
}
interface IConversationData
{
 id: string;
 learnerId: string;
 instructorId: string;
 courseId: string;
 unreadCount: number
 courseName: string;
}
const ConversationListComponent = ({ openChat, activeConversationId }: ListProps) => {
  const { data, isLoading } = useGetAllConversation();
  if(isLoading)
  {
    return <div>Loading...</div>
  }
  const conversationData: IConversationData[] | [] = data.conversationData;

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-xl font-bold dark:text-white">All Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversationData.map((chat: IConversationData) => (
          <button
            key={chat.id}
            onClick={() => openChat(chat.id)} // Correctly using conversation ID
            className={`w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800 transition-all ${
              activeConversationId === chat.id 
                ? "bg-blue-50 dark:bg-slate-800 border-r-4 border-r-blue-600" 
                : "hover:bg-gray-100 dark:hover:bg-slate-800/50"
            }`}
          >
            <div className="flex flex-col overflow-hidden">
              <span className={`font-semibold truncate dark:text-slate-200 ${activeConversationId === chat.id ? "text-blue-600" : ""}`}>
                {/* Fallback to Course ID as a label if no name exists */}
                Course: {chat.courseName}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-slate-500 truncate mt-1">
                ID: {chat.courseName}
              </span>
            </div>

            {chat.unreadCount > 0 && (
              <div className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {chat.unreadCount}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
export default ConversationListComponent;