/* eslint-disable no-undef */
import { useState, useRef, useEffect } from "react";
import { Send, X, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useGetChatbotReply } from "@/hooks/shared/chatbot/chatbot.get.reply.hook";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatBotMutation = useGetChatbotReply();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: "1", sender: "bot", text: "System Online. How can I assist you today?" }]);
    }
  }, [isOpen, messages.length]);

  // Logic to handle API key vs User-facing Label
  const sendMessage = async (payload: string, displayLabel?: string) => {
    const apiQuery = payload.trim();
    const userSee = displayLabel || apiQuery;

    if (!apiQuery || isLoading) return;

    // 1. Show the nice label to the user
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: userSee }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // 2. Send the "KEY" (e.g., SESSION_BOOK) to the API
      const response = await chatBotMutation.mutateAsync(apiQuery);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: response?.reply ?? "Agent unavailable.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: "err", sender: "bot", text: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wrapper ensures the chatbot doesn't block other page elements
    <div className="fixed inset-0 pointer-events-none z-[9999] flex flex-col items-end justify-end p-4 md:p-8">
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-full max-w-[380px] h-[550px] max-h-[80vh] flex flex-col bg-white dark:bg-[#050505] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* HEADER */}
          <div className="shrink-0 p-6 bg-blue-600 dark:bg-blue-700 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-black text-xs uppercase tracking-widest leading-none">
                  LearnCircle Agent
                </h4>
                <p className="text-blue-100 text-[10px] font-bold mt-1 uppercase tracking-tighter">
                  Secure Link Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 overflow-hidden bg-slate-50/50 dark:bg-black/40">
            <ScrollArea ref={scrollAreaRef} className="h-full px-4">
              <div className="py-8 space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {msg.sender === "bot" && (
                      <div className="h-8 w-8 shrink-0 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed max-w-[80%] shadow-sm",
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-none",
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 ml-10">
                    <div className="flex gap-1.5 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border dark:border-white/5">
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-duration:0.8s]" />
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* FOOTER */}
          <div className="shrink-0 p-5 bg-white dark:bg-[#050505] border-t border-slate-100 dark:border-white/5">
            <div className="flex flex-wrap gap-2 mb-4">
              <QuickBtn
                label="How to book Session ?"
                onClick={() => sendMessage("SESSION_BOOK", "How do I book a session?")}
              />
              <QuickBtn
                label="Support"
                onClick={() => sendMessage("CONTACT_SUPPORT", "I need to contact support.")}
              />
              <QuickBtn
                label="Password"
                onClick={() => sendMessage("RESET_PASSWORD", "How do I change my password?")}
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-2xl p-2 border-2 border-transparent focus-within:border-blue-600 focus-within:bg-transparent transition-all">
              <input
                className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 font-medium"
                placeholder="Ask me anything..."
                value={inputMessage}
                disabled={isLoading}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(inputMessage)}
              />
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={isLoading || !inputMessage.trim()}
                className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRIGGER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "pointer-events-auto h-16 w-16 rounded-full shadow-[0_10px_40px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all duration-500 active:scale-90",
          isOpen
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-90"
            : "bg-blue-600 text-white hover:scale-110",
        )}
      >
        {isOpen ? <X size={28} /> : <Bot size={32} />}
      </button>
    </div>
  );
};

const QuickBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="text-[10px] font-black uppercase tracking-widest px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-transparent hover:shadow-lg active:scale-95"
  >
    {label}
  </button>
);

export default Chatbot;
