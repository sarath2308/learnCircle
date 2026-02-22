import { useGetConversationOrCreate } from "@/hooks/shared/chat/conversation.get.hook";
import { useGetMessages } from "@/hooks/shared/chat/message.get";
import type { RootState } from "@/redux/store";
import { connectSocket, getSocket } from "@/socket/socket";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, UserCircle2, MoreHorizontal, GraduationCap, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

const InstructorConnectComponent = ({ courseId }: { courseId: string }) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserId = useSelector((state: RootState) => state.currentUser.currentUser?.id);

  const { data: conversation, isLoading: convLoading } = useGetConversationOrCreate(courseId);
  const conversationId = conversation?.conversationData?.id;
  const { data: messageRes, isLoading: msgLoading } = useGetMessages(conversationId);

  // Sync initial fetch
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

    socket.emit("chat:join", { conversationId });

    const onMessage = (newMessage: Message) => {
      // Logic check: only add if it's not already there
      setLocalMessages((prev) =>
        prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage],
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

    getSocket().emit("chat:send", {
      conversationId,
      content: input,
    });
    setInput("");
  };

  if (convLoading || msgLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center bg-slate-50 rounded-2xl border">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Securing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] w-full border border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden transition-all">
      {/* Header - Full Width */}
      <header className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">Instructor Connect</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Support Active
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Message List - Full Width */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
        {localMessages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id || idx}
              className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                isMe ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "flex items-end gap-2 max-w-[80%]",
                  isMe ? "flex-row-reverse" : "flex-row",
                )}
              >
                {!isMe && (
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center">
                    <UserCircle2 className="w-5 h-5 text-slate-500" />
                  </div>
                )}

                <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm border transition-all",
                      isMe
                        ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none shadow-indigo-100"
                        : "bg-white text-slate-700 border-slate-200 rounded-tl-none",
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-semibold tracking-tighter">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area - Full Width */}
      <footer className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-3 items-center w-full max-w-none">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the instructor a question..."
              className="w-full py-6 pl-4 pr-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-indigo-600 focus-visible:bg-white transition-all shadow-inner"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim()}
            className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95 shrink-0"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default InstructorConnectComponent;
