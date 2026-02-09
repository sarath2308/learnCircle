import React, { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import InstructorBookingPage from '@/components/learner/session.booking';
import { useGetProfessionalProfile } from '@/hooks/learner/professionals/learner.get.professional.profile.user';
import { useGetAvailability } from '@/hooks/learner/availability/learner.get.availability';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Explicit interfaces based on your request
export interface ISlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const InstructorBookingContainer = () => {
  const { instructorId } = useParams<{ instructorId: string }>();
  const [isBooking, setIsBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString("en-CA")); // "2026-02-23"

  // 1. Data Fetching - Profile
  const { data: profileResponse, isLoading: profileLoading, error: profileError } = 
    useGetProfessionalProfile(instructorId || "");

  // 2. Data Fetching - Availability based on date selection
  const { data: availabilityResponse, isLoading: availabilityLoading } = 
    useGetAvailability(instructorId || "", selectedDate);

  const profileData = profileResponse?.profileData;
  const slots: ISlot[] = availabilityResponse?.availabilityData?.slots || [];

  // 3. Logic: Filter and Format Slots
// Inside InstructorBookingContainer
const getSlotsForDate = useCallback((date: Date | undefined) => {
  if (!date) return [];
  
  const dateString = date.toLocaleDateString("en-CA")
  if (dateString !== selectedDate) {
    setSelectedDate(dateString);
  }

  // DO NOT FILTER. Return all slots with their status.
  return slots.map(slot => ({
    time: `${slot.startTime} - ${slot.endTime}`,
    isAvailable: slot.isAvailable
  }));
}, [slots, selectedDate]);

  // 4. Logic: Dynamic Pricing
  const getPriceForDate = useCallback((date: Date | undefined) => {
    // Note: I changed sessionPrice to match your IPrfileResponse interface
    const basePrice = profileData?.sessionPrice || 100; 
   
    return availabilityResponse?.availabilityData?.price || basePrice;
  }, [slots]);

  // 5. Logic: Booking Handler
  const handleBooking = async (date: Date | undefined, slot: string | null, finalPrice: number) => {
    if (!date || !slot) return;
    setIsBooking(true);
    try {
      // API call placeholder for booking
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Booking request: ${instructorId} at ${slot} for $${finalPrice}`);
      toast.success("Booking successful! Check your sessions for details.");
    } catch (err) {
      console.error("Booking failed", err);
    } finally {
      setIsBooking(false);
    }
  };

  // 6. Loading & Error Alignment Fixes
  if (!instructorId) return <ErrorState message="Instructor ID is missing" />;
  if (profileLoading) return <LoadingState />;
  if (profileError || !profileData) return <ErrorState message="Profile not found" />;

  return (
    <InstructorBookingPage 
      instructor={{
        ...profileData,
        // Mapping profile_key to profileUrl if that's your field naming
        profileUrl: profileData.profile_key 
      }}
      onBook={handleBooking}
      getSlots={getSlotsForDate}
      getPrice={getPriceForDate}
      isBookingLoading={isBooking}
      isSlotsLoading={availabilityLoading} // Pass this to show a loader in the slot grid
    />
  );
};

// Refactored UI sub-components for cleaner container alignment
const LoadingState = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020617]">
    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
    <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">Syncing Schedule...</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617]">
    <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-red-100 dark:border-red-900/20 max-w-sm">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">System Error</h2>
      <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">{message}</p>
    </div>
  </div>
);

export default InstructorBookingContainer;