import React, { useMemo } from 'react';
import { Clock, Video, CheckCircle, BadgeIndianRupee, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Shadcn Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { BookingStatus } from '@/pages/Learner/learner.profile.myBookings';
import { useCheckSessionJoinPermission } from '@/hooks/shared/session-booking/session.check.join.hook';
import { cn } from "@/lib/utils"; // Standard Shadcn utility

interface SessionCardProps {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  typeOfSession: string;
  status: BookingStatus;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  id,
  date,
  startTime,
  endTime,
  price,
  typeOfSession,
  status
}) => {
  const navigate = useNavigate();
  const checkJoinPermissionMutation = useCheckSessionJoinPermission();

  const handleJoinClick = async () => {
    try {
      const response = await checkJoinPermissionMutation.mutateAsync(id);
      navigate(`/learner/video-call/${response.data.roomId}`);
    } catch (err) {
      console.error("Error checking join permission:", err);
    }
  };

  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-US', { month: 'short' });

  const isJoinable = useMemo(() => {
    if (status !== BookingStatus.CONFIRM) return false;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sessionDateStr = dateObj.toISOString().split('T')[0];
    if (todayStr !== sessionDateStr) return false;

    const getMinutes = (time: string) => {
      const [hrs, mins] = time.split(':').map(Number);
      return hrs * 60 + mins;
    };
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMins = getMinutes(startTime);
    const endMins = getMinutes(endTime);
    return currentMinutes >= startMins - 5 && currentMinutes <= endMins;
  }, [date, startTime, endTime, status]);

  return (
    <Card className="group overflow-hidden border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 flex flex-wrap items-center gap-4">
        
        {/* Date Anchor - Always stays locked left */}
        <div className="flex flex-col items-center justify-center bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-2 w-16 h-16 shrink-0 border border-blue-100 dark:border-blue-900/20">
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase leading-none tracking-tighter">{month}</span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-50">{day}</span>
        </div>

        {/* Content Section - High Scannability */}
        <div className="flex-1 min-w-[200px] space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base md:text-lg leading-tight capitalize">
            {typeOfSession}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Badge using Shadcn Primitive */}
            <Badge 
              variant="outline" 
              className={cn(
                "px-2 py-0 text-[10px] uppercase tracking-widest font-bold border-transparent",
                status === BookingStatus.CONFIRM 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" 
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              <span className={cn(
                "mr-1.5 h-1.5 w-1.5 rounded-full",
                status === BookingStatus.CONFIRM ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              )} />
              {status}
            </Badge>

            {/* Price Badge */}
            <Badge variant="outline" className="bg-green-400 text-white dark:bg-slate-800  dark:text-slate-300 px-2 py-0 text-[10px] font-bold">
              <BadgeIndianRupee className="mr-1 h-3 w-3" />
              {price}
            </Badge>
          </div>
        </div>

        {/* Action Column - Right Aligned & Container Responsive */}
        <div className="flex flex-wrap items-center gap-4 ml-auto w-full sm:w-auto">
          <div className="flex flex-col items-start sm:items-end justify-center pr-4 sm:border-r border-slate-100 dark:border-slate-800 h-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Clock className="h-3 w-3 text-blue-500" />
              {startTime}
            </div>
          </div>

          <div className="flex-1 sm:flex-none">
            {isJoinable ? (
              <Button 
                onClick={handleJoinClick}
                disabled={checkJoinPermissionMutation.isPending}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all active:scale-95"
              >
                {checkJoinPermissionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Video className="mr-2 h-4 w-4" /> Join Now</>
                )}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                disabled 
                className="w-full sm:w-auto rounded-xl border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-xs font-bold"
              >
                {status === BookingStatus.COMPLETED ? (
                  <><CheckCircle className="mr-2 h-4 w-4" /> Ended</>
                ) : (
                  "Upcoming"
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};