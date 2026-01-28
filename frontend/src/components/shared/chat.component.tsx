import { useGetMessages } from "@/hooks/shared/chat/message.get";
import type { RootState } from "@/redux/store";
import { connectSocket, getSocket } from "@/socket/socket";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
// Assuming you have these Shadcn components or similar
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, MessageCircle } from "lucide-react";

interface ChatComponentProps {
  conversationId: string
  title?: string;
}

const ChatComponent = ({ conversationId, title = "Course Discussion" }: ChatComponentProps) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = useSelector((state: RootState) => state.currentUser.currentUser?.id);

  const { data: messageRes, isLoading: msgLoading } = useGetMessages(conversationId);

  useEffect(() => {
    if (messageRes?.messageData) setLocalMessages(messageRes.messageData);
    else if (!conversationId) setLocalMessages([]);
  }, [messageRes, conversationId]);

useEffect(() => {
  if (!conversationId) return;

  const socket = getSocket();

  socket.emit("chat:join", { conversationId });

  const onMessage = (newMessage: any) => {
    if (newMessage.conversationId !== conversationId) return;
    setLocalMessages(prev =>
      prev.find(m => m.id === newMessage.id)
        ? prev
        : [...prev, newMessage]
    );
  };

  socket.on("chat:message", onMessage);

  return () => {
    socket.emit("chat:leave", { conversationId }); // 🔥 REQUIRED
    socket.off("chat:message", onMessage);
  };
}, [conversationId]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;
    getSocket().emit("chat:send", { conversationId, content: input });
    setInput("");
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full rounded-xl border border-dashed bg-muted/30 text-muted-foreground p-10">
        <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
        <h3 className="font-semibold text-foreground">No Conversation Selected</h3>
        <p className="text-sm">Choose a chat from the sidebar to start responding.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[650px] w-full border rounded-xl bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Shadcn Style Header */}
      <div className="px-6 py-4 border-b bg-muted/50 backdrop-blur-sm flex items-center justify-between">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {localMessages.map((msg) => {
          const isMe = String(msg.senderId) === String(currentUserId);

          return (
            <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm transition-all duration-200 ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                      : "bg-secondary text-secondary-foreground rounded-tl-none border shadow-sm"
                  }`}
                >
                  <p className="leading-relaxed break-words">{msg.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1 font-medium">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Shadcn Styled Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t bg-card flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1 rounded-full bg-muted/50 focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          disabled={!input.trim()} 
          size="icon" 
          className="rounded-full shrink-0 h-10 w-10 shadow-lg transition-transform active:scale-90"
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;