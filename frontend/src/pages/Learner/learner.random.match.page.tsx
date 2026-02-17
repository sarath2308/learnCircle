import React, { useState, useEffect } from "react";
import {
  Users,
  Gamepad2,
  MessageCircle,
  Music,
  Palette,
  Binary,
  Globe,
  Zap,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSocket } from "@/socket/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

// --- Types & Temp Data ---
interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const CATEGORIES: Category[] = [
  {
    id: "all",
    label: "Worldwide",
    description: "Meet anyone, anywhere.",
    icon: <Globe className="w-6 h-6" />,
    color: "bg-blue-500",
  },
  {
    id: "gaming",
    label: "Gaming",
    description: "Talk about your favorite titles.",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "bg-indigo-500",
  },
  {
    id: "coding",
    label: "Dev Talk",
    description: "Bugs, frameworks, and coffee.",
    icon: <Binary className="w-6 h-6" />,
    color: "bg-emerald-500",
  },
  {
    id: "deep",
    label: "Deep Talk",
    description: "Philosophy and late-night vibes.",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "bg-purple-500",
  },
  {
    id: "music",
    label: "Music",
    description: "Share what you are listening to.",
    icon: <Music className="w-6 h-6" />,
    color: "bg-rose-500",
  },
  {
    id: "art",
    label: "Art & Design",
    description: "Showcase your latest creation.",
    icon: <Palette className="w-6 h-6" />,
    color: "bg-orange-500",
  },
];

export default function RandomMatching() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);
  const navigate = useNavigate();

  const handleStartSearch = () => {
    setIsSearching(true);
    const socket = getSocket();
    socket.emit("match:join-queue", { category: selectedCategory });
  };

  useEffect(() => {
    const socket = getSocket();

    const onWaiting = () => {
      console.log("⏳ Waiting for match...");
    };

    const onMatched = ({ roomId }: { roomId: string }) => {
      console.log("🎯 Matched! Room:", roomId);
      setIsSearching(false);
      navigate(`/${currentUser?.role}/video-call/${roomId}?mode=match`);

      // Step 1: just log it.
      // Step 2: we will navigate(`/video-call/${roomId}?mode=match`);
    };

    socket.on("match:waiting", onWaiting);
    socket.on("match:matched", onMatched);

    return () => {
      socket.off("match:waiting", onWaiting);
      socket.off("match:matched", onMatched);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200/30 dark:bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-200/30 dark:bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm mb-4 border border-slate-200 dark:border-zinc-800">
            <Zap className="w-8 h-8 text-blue-600 fill-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Connect with <span className="text-blue-600">Strangers</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-lg">
            Choose a vibe and start a conversation.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              onClick={() => !isSearching && setSelectedCategory(cat.id)}
              className={cn(
                "group relative p-6 cursor-pointer border-2 transition-all duration-200 hover:shadow-md active:scale-[0.98]",
                selectedCategory === cat.id
                  ? "border-blue-600 ring-2 ring-blue-600/10 bg-white dark:bg-zinc-900"
                  : "border-transparent bg-white/60 dark:bg-zinc-900/60 hover:border-slate-300 dark:hover:border-zinc-700",
              )}
            >
              <div className="flex flex-col h-full space-y-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110",
                    cat.color,
                  )}
                >
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-none mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 leading-snug">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Radio-style indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedCategory === cat.id
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 dark:border-zinc-700",
                )}
              >
                {selectedCategory === cat.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </Card>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center justify-center gap-4">
          <Button
            size="lg"
            disabled={isSearching}
            onClick={handleStartSearch}
            className={cn(
              "h-16 px-12 rounded-full text-lg font-bold transition-all duration-300 shadow-xl shadow-blue-500/20 w-full sm:w-auto",
              isSearching
                ? "bg-slate-200 dark:bg-zinc-800"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/40",
            )}
          >
            {isSearching ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching for a match...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Start Finding </span>
                <Users className="w-5 h-5 ml-2" />
              </div>
            )}
          </Button>

          <p className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-2 italic">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Realtime features active
          </p>
        </div>
      </div>
    </div>
  );
}
