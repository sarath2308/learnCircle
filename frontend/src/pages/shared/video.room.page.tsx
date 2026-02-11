import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Maximize2, Send, ShieldCheck, Hand, Share2, X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from 'react-router-dom';

export interface VideoRoomProps {
  instructorName: string;
   typeOfSession: string;
}
const VideoRoom = () => {
    const {roomId} = useParams<string>();
    const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState("");

  if(!roomId){
    navigate(-1);
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      
      {/* 1. STAGE AREA - Centered & Constrained */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-slate-100 dark:bg-black/20">
        
        {/* Top Info Bar - Anchored to the Video Box, not the Screen Edge */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 h-2 w-2 rounded-full animate-pulse" />
            <h1 className="text-sm font-black uppercase tracking-tight text-slate-600 dark:text-slate-300">
              Growth Hacking <span className="text-slate-400 font-medium">| 12 Participants</span>
            </h1>
          </div>
          <Badge variant="secondary" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm font-bold">
            00:45:12
          </Badge>
        </div>

        {/* MAIN VIDEO BOX - Locked Aspect Ratio */}
        <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none border border-slate-200 dark:border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover select-none"
            alt="Mentor"
          />

          {/* Floating Self-View (PiP) */}
          <div className="absolute top-4 right-4 w-32 md:w-48 aspect-video bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-white/10">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <VideoOff size={20} className="text-slate-400" />
              </div>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop" 
                className="w-full h-full object-cover"
                alt="Your Stream"
              />
            )}
          </div>

          {/* Mentor Name Overlay */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/90 dark:bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg">
            <div className="h-8 w-8 rounded-xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="avatar" />
            </div>
            <span className="text-xs font-bold pr-2 dark:text-white">Raj Patel (Mentor)</span>
          </div>
        </div>

        {/* CONTROLS - Anchored below video */}
        <div className="mt-8 flex items-center gap-3 md:gap-6 bg-white dark:bg-slate-900/90 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl">
          <div className="flex items-center gap-2">
            <ControlButton icon={isMuted ? <MicOff size={20} /> : <Mic size={20} />} active={!isMuted} onClick={() => setIsMuted(!isMuted)} />
            <ControlButton icon={isVideoOff ? <VideoOff size={20} /> : <Video size={20} />} active={!isVideoOff} onClick={() => setIsVideoOff(!isVideoOff)} />
          </div>
          
          <div className="hidden md:flex items-center gap-2 border-x border-slate-100 dark:border-white/10 px-4">
             <ControlButton icon={<Hand size={20} />} />
             <ControlButton icon={<Share2 size={20} />} />
             <ControlButton 
                icon={<MessageSquare size={20} />} 
                active={isChatOpen} 
                onClick={() => setIsChatOpen(!isChatOpen)}
              />
          </div>
          
          <button className="h-12 px-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 rounded-2xl transition-all active:scale-95 text-white font-black text-sm shadow-lg shadow-red-200 dark:shadow-none">
            <PhoneOff size={18} />
            <span className="hidden sm:inline">End Call</span>
          </button>
        </div>
      </main>

      {/* 2. CHAT SIDEBAR - Clean & Vertical */}
      <aside className={cn(
        "bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/5 transition-all duration-300 flex flex-col shrink-0 shadow-2xl md:shadow-none",
        isChatOpen ? "w-full md:w-[350px] lg:w-[400px]" : "w-0 border-none invisible md:visible"
      )}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-50 dark:border-white/5">
          <h2 className="font-extrabold uppercase tracking-widest text-xs text-slate-500">Session Chat</h2>
          <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-5">
          <div className="space-y-6">
            <ChatMessage user="Aisha Sharma" message="Can you share the deck later?" isMe={false} />
            <ChatMessage user="You" message="I'll record this part." isMe={true} />
            <ChatMessage user="Raj Patel" message="I'll share the PDF in the portal." isMentor={true} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-5 bg-slate-50/50 dark:bg-transparent border-t border-slate-100 dark:border-white/5">
          <div className="relative">
            <Input 
              placeholder="Type a message..." 
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl h-12 pr-12 focus-visible:ring-blue-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

/* --- MINI COMPONENTS FOR CLEANER CODE --- */

const ControlButton = ({ icon, active = false, onClick }: { icon: React.ReactNode, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "h-11 w-11 rounded-xl flex items-center justify-center transition-all active:scale-90 border",
      active 
        ? "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white border-slate-200 dark:border-white/10 hover:bg-white shadow-sm" 
        : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:border-red-500/20 shadow-sm"
    )}
  >
    {icon}
  </button>
);

const ChatMessage = ({ user, message, isMe = false, isMentor = false }: any) => (
  <div className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
    <span className={cn("text-[10px] font-black uppercase tracking-widest px-1", isMentor ? "text-emerald-600" : "text-slate-400")}>
      {user}
    </span>
    <div className={cn(
      "max-w-[85%] p-3 rounded-2xl text-[13px] font-medium leading-snug",
      isMe 
        ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100 dark:shadow-none" 
        : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-white/5"
    )}>
      {message}
    </div>
  </div>
);

export default VideoRoom;