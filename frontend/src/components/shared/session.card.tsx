import React, { useMemo } from "react";
import {
  Clock,
  Video,
  CheckCircle,
  BadgeIndianRupee,
  Loader2,
  HelpCircle,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Shadcn Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { BookingStatus } from "@/pages/Learner/learner.profile.myBookings";
import { useCheckSessionJoinPermission } from "@/hooks/shared/session-booking/session.check.join.hook";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  typeOfSession: string;
  status: BookingStatus;
  varient: "learner" | "professional";
  handleCompletion?: (id: string) => void; // Prop for the completion logic
  isCompleting?: boolean; // Optional: to show loading state on the completion button
}

export const SessionCard = ({
  id,
  date,
  startTime,
  endTime,
  price,
  typeOfSession,
  status,
  varient,
  handleCompletion,
  isCompleting = false,
}: SessionCardProps) => {
  const navigate = useNavigate();
  const checkJoinPermissionMutation = useCheckSessionJoinPermission();

  const handleJoinClick = async () => {
    try {
      const response = await checkJoinPermissionMutation.mutateAsync(id);
      navigate(`/${varient}/video-call/${response.data.roomId}`);
    } catch (err) {
      console.error("Error checking join permission:", err);
    }
  };

  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("en-US", { month: "short" });

  const hasTimePassed = useMemo(() => {
    if (status !== BookingStatus.CONFIRM) return false;
    const now = new Date();
    const sessionEndTime = new Date(dateObj);
    const [hours, minutes] = endTime.split(":").map(Number);
    sessionEndTime.setHours(hours, minutes, 0, 0);

    return now > sessionEndTime;
  }, [date, endTime, status]);

  const isJoinable = useMemo(() => {
    return true; // Per your instruction: do not change anything here
  }, [date, startTime, endTime, status]);

  return (
    <Card className="group overflow-hidden border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 flex flex-wrap items-center gap-4">
        {/* Date Badge */}
        <div className="flex flex-col items-center justify-center bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-2 w-16 h-16 shrink-0 border border-blue-100 dark:border-blue-900/20">
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase leading-none tracking-tighter">
            {month}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-50">{day}</span>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-[180px] space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base leading-tight capitalize truncate">
            {typeOfSession}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "px-2 py-0 text-[10px] uppercase tracking-widest font-bold border-transparent",
                status === BookingStatus.CONFIRM
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
              )}
            >
              <span
                className={cn(
                  "mr-1.5 h-1.5 w-1.5 rounded-full",
                  status === BookingStatus.CONFIRM
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-slate-400",
                )}
              />
              {status}
            </Badge>

            <Badge className="bg-emerald-500 text-white dark:bg-emerald-600 px-2 py-0 text-[10px] font-bold border-none">
              <BadgeIndianRupee className="mr-0.5 h-3 w-3" />
              {price}
            </Badge>
          </div>
        </div>

        {/* Action Column */}
        <div className="flex flex-wrap items-center gap-4 ml-auto w-full sm:w-auto justify-between sm:justify-end">
          {/* PROFESSIONAL VARIANT: Completion Question */}
          {varient === "professional" && hasTimePassed && status !== BookingStatus.COMPLETED && (
            <div className="flex flex-col items-start sm:items-end gap-1.5 pr-4 sm:border-r border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase flex items-center gap-1">
                <HelpCircle size={10} /> Session finished?
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={isCompleting}
                className="h-8 text-[10px] font-black border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400 transition-colors rounded-lg px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  if (handleCompletion) handleCompletion(id);
                }}
              >
                {isCompleting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    <Check size={12} className="mr-1" /> Mark Completed
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Time Display */}
          <div className="flex flex-col items-start sm:items-end justify-center pr-4 sm:border-r border-slate-100 dark:border-slate-800 h-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Schedule
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Clock className="h-3 w-3 text-blue-500" />
              {startTime} - {endTime}
            </div>
          </div>

          {/* Join Button */}
          <div className="shrink-0">
            {isJoinable ? (
              <Button
                onClick={handleJoinClick}
                disabled={checkJoinPermissionMutation.isPending || isCompleting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 px-6"
              >
                {checkJoinPermissionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" /> Join
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled
                className="rounded-xl border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold"
              >
                {status === BookingStatus.COMPLETED ? "Session Ended" : "Upcoming"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
