import React, { useState } from 'react';
import { SessionCard } from "@/components/shared/session.card";
import { useGetSessions } from '@/hooks/learner/session-booking/learner.session.get.hook';
import { Inbox, Loader2 } from 'lucide-react';
import { useGetProf } from '@/hooks/profesional/useGetProf';
import { useGetProfessionalSessions } from '@/hooks/profesional/session-booking/professionsl.get.session';
import { useMarkSessionAsCompleted } from '@/hooks/profesional/session-booking/professional.mark.completed.hook';

export enum BookingStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  CONFIRM = "confirmed",
  CANCELLED = "cancelled",
}

export interface SessionBooking {
  id: string;
  instructorId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  typeOfSession: string;
  status: BookingStatus;
}

const BookingsPage: React.FC = () => {
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');
  const { data: sessions, isLoading } = useGetProfessionalSessions();
 const completeMutation = useMarkSessionAsCompleted();

  const handleCompletion = async(sessionId: string) => {

    await completeMutation.mutateAsync(sessionId);
  }

  // 1. SAFE DATA ACCESS
  // Fallback to empty arrays if data is still loading or undefined
  const upcoming = sessions?.data?.upcoming || [];
  const completed = sessions?.data?.completed || [];
  
  // 2. DYNAMIC LIST SELECTION
  const displayList = tab === 'upcoming' ? upcoming : completed;

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">Syncing your schedule...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sessions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage and join your mentorship calls</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto shadow-inner">
          {(['upcoming', 'completed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 sm:px-8 py-2 text-sm font-bold capitalize rounded-lg transition-all ${
                tab === t 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {displayList.length > 0 ? (
        <div className="grid gap-4">
          {displayList.map((booking: SessionBooking) => (
            <SessionCard 
              key={booking.id}
              {...booking} 
              varient='professional'
              handleCompletion={() => handleCompletion(booking.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800 py-24 text-center">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-5 mb-5 shadow-inner">
            <Inbox className="h-12 w-12 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white capitalize">No {tab} sessions found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm mt-2">
            When you book a {tab === 'upcoming' ? 'new' : 'past'} session, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;