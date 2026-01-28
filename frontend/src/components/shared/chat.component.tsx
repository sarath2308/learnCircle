import { useGetMessages } from "@/hooks/shared/chat/message.get";
import type { RootState } from "@/redux/store";
import { getSocket } from "@/socket/socket";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  SendHorizontal, 
  MessageCircle, 
  MoreVertical, 
  Circle, 
  Hash, 
  SmilePlus,
  Paperclip,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  senderName?: string;
}

interface ChatComponentProps {
  conversationId: string;
  title?: string;
}

const ChatComponent = ({ conversationId, title = "Course Discussion" }: ChatComponentProps) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = useSelector((state: RootState) => state.currentUser.currentUser?.id);

  const { data: messageRes } = useGetMessages(conversationId);

  useEffect(() => {
    if (messageRes?.messageData) setLocalMessages(messageRes.messageData);
    else if (!conversationId) setLocalMessages([]);
  }, [messageRes, conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const socket = getSocket();
    socket.emit("chat:join", { conversationId });

    const onMessage = (newMessage: Message) => {
      setLocalMessages(prev => 
        prev.some(m => m.id === newMessage.id) ? prev : [...prev, newMessage]
      );
    };

    socket.on("chat:message", onMessage);
    return () => {
      socket.emit("chat:leave", { conversationId });
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
      <div className="flex flex-col items-center justify-center h-[700px] w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-slate-400">
        <div className="p-5 rounded-full bg-white mb-4 shadow-sm border border-slate-100">
          <MessageCircle className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="font-semibold text-slate-600 text-lg">Select a Thread</h3>
        <p className="text-sm text-slate-400">Click a conversation to start messaging.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] w-full border border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* --- Light Mode Header --- */}
      <header className="px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight leading-none mb-1.5 flex items-center gap-2">
              {title}
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </h3>
            <div className="flex items-center gap-1.5">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-50 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* --- Message Area --- */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F8FAFC]">
        {localMessages.map((msg, idx) => {
          const isMe = String(msg.senderId) === String(currentUserId);
          
          return (
            <div 
              key={msg.id || idx} 
              className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-3 duration-500",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>
                {!isMe && (
                  <span className="text-[11px] font-extrabold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
                    User
                  </span>
                )}
                <div
                  className={cn(
                    "relative px-4 py-3 rounded-2xl text-[14.5px] leading-relaxed shadow-sm transition-all border",
                    isMe 
                      ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-indigo-100 shadow-md" 
                      : "bg-white text-slate-700 border-slate-200 rounded-tl-none"
                  )}
                >
                  <p className="break-words font-medium">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 px-1 font-semibold tracking-wide">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* --- Light Mode Input Area --- */}
      <footer className="p-5 border-t border-slate-100 bg-white">
        <form onSubmit={handleSend} className="relative max-w-5xl mx-auto flex gap-3 items-center">
          <div className="relative flex-1 group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
               <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Paperclip className="h-5 w-5" />
               </Button>
            </div>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="w-full pl-14 pr-12 py-7 bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:bg-white text-slate-800 placeholder:text-slate-400 transition-all border shadow-inner"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-amber-500">
                <SmilePlus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!input.trim()} 
            className="h-[52px] w-[52px] rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:scale-95 shrink-0"
          >
            <SendHorizontal className="h-6 w-6" />
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default ChatComponent;