"use client";

import React from "react";
import { Star, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
  instructorId: string;
  name: string;
  title: string;
  rating: number;
  profileUrl: string;
  isLive?: boolean; // New prop for the status indicator
}

const ProfessionalProfileCard = ({
  instructorId,
  name,
  title,
  rating,
  profileUrl,
  isLive = false,
}: ProfileProps) => {
  const navigate = useNavigate();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={() => navigate(`/learner/professionals/${instructorId}`)}
      className="group cursor-pointer flex flex-col items-center transition-all duration-500 hover:-translate-y-2"
    >
      {/* LARGE CIRCULAR AVATAR - Matches image style */}
      <div className="relative mb-6">
        {/* Animated Glow for Live Status */}
        {isLive && (
          <div className="absolute -inset-2 bg-indigo-500/20 rounded-full animate-pulse blur-md" />
        )}

        <div className="relative">
          <Avatar className="h-40 w-40 md:h-48 md:w-48 border-[8px] border-white dark:border-[#050505] shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105">
            <AvatarImage src={profileUrl} alt={name} className="object-cover" />
            <AvatarFallback className="bg-slate-100 dark:bg-white/5 text-2xl font-black">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Live Indicator Badge */}
          {isLive && (
            <div className="absolute bottom-2 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-xl border-4 border-white dark:border-[#050505]">
              <Zap size={14} fill="currentColor" />
            </div>
          )}
        </div>
      </div>

      {/* TYPOGRAPHY - Clean & Editorial */}
      <div className="text-center space-y-1 max-w-[200px]">
        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600">
          {name}
        </h3>

        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          {title} <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
          <span className="flex items-center gap-1">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfessionalProfileCard;
