import { useGetConversationOrCreate } from "@/hooks/shared/chat/conversation.get.hook";
import { useGetMessages } from "@/hooks/shared/chat/message.get";
import type { RootState } from "@/redux/store";
import { connectSocket, getSocket } from "@/socket/socket";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface ChatComponentProps {
  courseId: string;
}

// Define a proper interface. Stop using 'any'.
interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

const InstructorConnectComponent = ({ courseId }: ChatComponentProps) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserId = useSelector((state:RootState)=> state.currentUser.currentUser?.id)

  const { data: conversation, isLoading: convLoading } = useGetConversationOrCreate(courseId);
  const conversationId = conversation?.conversationData?.id;
  const { data: messageRes, isLoading: msgLoading } = useGetMessages(conversationId);

  // Sync initial fetch to local state
  useEffect(() => {
    if (messageRes?.messageData) {
      setLocalMessages(messageRes.messageData);
    }
  }, [messageRes]);

  // Socket management
  useEffect(() => {
    if (!conversationId) return;

    connectSocket();
    const socket = getSocket();

    const onMessage = (newMessage: Message) => {
        toast.success("called")
      setLocalMessages((prev) => [...prev, newMessage]);
    };
     socket.emit("chat:join", {
  conversationId
});

    socket.on("chat:message", onMessage);

    return () => {
      socket.off("chat:message", onMessage); // Cleanup is non-negotiable
    };
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    getSocket().emit("chat:send", {
      conversationId,
      content: input,
    });
    setInput("");
  };

  if (convLoading || msgLoading) return <div className="p-4 text-center">Loading chat...</div>;

// ... (Your existing imports and logic stay the same)

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl border rounded-xl bg-gray-50 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-white font-semibold text-gray-700 shadow-sm">
        Course Discussion
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {localMessages.map((msg) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
              </div>
              
              <span className={`text-[10px] text-gray-400 mt-1 px-1`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          );
        })}
        {/* Invisible div to anchor the scroll-to-bottom behavior */}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {/* Simple Send Icon (Arrow) */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default InstructorConnectComponent