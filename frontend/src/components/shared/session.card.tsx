"use client";
import { useMemo, useState } from "react";
import {
  Clock,
  Video,
  CheckCircle,
  BadgeIndianRupee,
  Loader2,
  HelpCircle,
  Check,
  Star,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Shadcn Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPortal,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { BookingStatus } from "@/pages/Learner/learner.profile.myBookings";
import { useCheckSessionJoinPermission } from "@/hooks/shared/session-booking/session.check.join.hook";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  id: string;
  instructorId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  typeOfSession: string;
  status: BookingStatus;
  varient: "learner" | "professional";
  handleCompletion?: (id: string) => void;
  isCompleting?: boolean;
  handleRating?: (id: string, data: { rating: number; feedback: string }) => void;
}

export const SessionCard = ({
  id,
  instructorId,
  date,
  startTime,
  endTime,
  price,
  typeOfSession,
  status,
  varient,
  handleCompletion,
  isCompleting = false,
  handleRating,
}: SessionCardProps) => {
  const navigate = useNavigate();
  const checkJoinPermissionMutation = useCheckSessionJoinPermission();

  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleJoinClick = async () => {
    try {
      const response = await checkJoinPermissionMutation.mutateAsync(id);
      navigate(`/${varient}/video-call/${response.data.roomId}?mode=session`);
    } catch (err) {
      console.error("Join error:", err);
    }
  };

  const submitRating = () => {
    const ratingData = { rating, feedback };
    console.log(`%c[SESSION_FEEDBACK] ID: ${id}`, "color: #6366f1; font-weight: bold;", ratingData);

    if (handleRating) handleRating(instructorId, ratingData);
    setIsRatingOpen(false);
    setRating(0);
    setFeedback("");
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
  }, [dateObj, endTime, status]);

  return (
    <>
      <Card className="group overflow-hidden border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-xl transition-all duration-500">
        <CardContent className="p-5 flex flex-wrap items-center gap-6">
          {/* Date UI */}
          <div className="flex flex-col items-center justify-center bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[1.25rem] p-2 w-16 h-16 shrink-0 border border-indigo-100 dark:border-indigo-900/20 shadow-sm">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase leading-none tracking-tighter">
              {month}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-50">{day}</span>
          </div>

          <div className="flex-1 min-w-[180px] space-y-2">
            <h3 className="font-black text-slate-900 dark:text-slate-50 text-base leading-tight capitalize truncate tracking-tight">
              {typeOfSession}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-0.5 text-[9px] uppercase tracking-[0.15em] font-black border-transparent rounded-lg",
                  status === BookingStatus.CONFIRM
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40"
                    : "bg-slate-100 text-slate-600",
                )}
              >
                <span
                  className={cn(
                    "mr-2 h-1.5 w-1.5 rounded-full",
                    status === BookingStatus.CONFIRM
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-slate-400",
                  )}
                />
                {status}
              </Badge>
              <Badge className="bg-slate-900 text-white px-3 py-0.5 text-[9px] font-black border-none rounded-lg tracking-widest uppercase">
                <BadgeIndianRupee className="mr-1 h-3 w-3" /> {price}
              </Badge>
            </div>
          </div>

          {/* Actions Column */}
          <div className="flex flex-wrap items-center gap-5 ml-auto w-full sm:w-auto justify-between sm:justify-end">
            {varient === "learner" && status === BookingStatus.COMPLETED && (
              <div className="flex flex-col items-start sm:items-end gap-1.5 pr-5 sm:border-r border-slate-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <CheckCircle size={10} /> Feedback
                </span>
                <Button
                  size="sm"
                  className="h-9 text-[10px] font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 shadow-lg shadow-indigo-600/10 active:scale-95 transition-all"
                  onClick={() => setIsRatingOpen(true)}
                >
                  <Star size={12} className="mr-2 fill-current" /> RATE SESSION
                </Button>
              </div>
            )}

            {varient === "professional" && hasTimePassed && status !== BookingStatus.COMPLETED && (
              <div className="flex flex-col items-start sm:items-end gap-1.5 pr-5 sm:border-r border-slate-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <HelpCircle size={10} /> Finalize
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isCompleting}
                  className="h-9 text-[10px] font-black border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-xl px-5"
                  onClick={() => handleCompletion?.(id)}
                >
                  {isCompleting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <>
                      <Check size={12} className="mr-2" /> MARK AS DONE
                    </>
                  )}
                </Button>
              </div>
            )}

            <div className="flex flex-col items-start sm:items-end justify-center pr-5 sm:border-r border-slate-100 dark:border-slate-800 h-10">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                TIMELINE
              </span>
              <div className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-200">
                <Clock className="h-3 w-3 text-indigo-500" /> {startTime} — {endTime}
              </div>
            </div>

            <div className="shrink-0">
              {status !== BookingStatus.COMPLETED ? (
                <Button
                  onClick={handleJoinClick}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl px-8 h-11 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <Video className="mr-2 h-4 w-4" /> JOIN NOW
                </Button>
              ) : (
                <div className="px-6 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  CLOSED
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RATING MODAL WITH PORTAL FIX */}
      <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
        <DialogPortal>
          <DialogContent className="sm:max-w-[400px] z-[100] rounded-[2.5rem] p-8 border-none bg-white dark:bg-slate-950 shadow-2xl">
            <DialogHeader className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center text-indigo-600">
                <Star size={32} className="fill-current" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase text-center">
                Session Feedback
              </DialogTitle>
              <DialogDescription className="text-center text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                Your input maintains <br /> our quality standards.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-all active:scale-125"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      size={32}
                      className={cn(
                        "transition-colors",
                        (hover || rating) >= star
                          ? "fill-indigo-500 text-indigo-500"
                          : "fill-slate-100 text-slate-200 dark:fill-slate-800",
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="w-full space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <MessageSquare size={12} className="text-indigo-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    COMMENTS
                  </span>
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  className="min-h-[100px] rounded-2xl border-slate-100 bg-slate-50/50 dark:bg-slate-900 font-medium text-sm resize-none focus-visible:ring-indigo-500"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-col gap-2">
              <Button
                disabled={rating === 0}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20"
                onClick={submitRating}
              >
                SUBMIT FEEDBACK
              </Button>
              <Button
                variant="ghost"
                className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900"
                onClick={() => setIsRatingOpen(false)}
              >
                Skip
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
