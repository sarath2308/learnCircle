import React, { useState } from 'react';
import { Star, Briefcase, Video, Users, CheckCircle2, Loader2, Calendar as CalendarIcon, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const InstructorBookingPage = ({ instructor, onBook, getSlots, getPrice, isBookingLoading, isSlotsLoading }: any) => {
  
const today = React.useMemo(() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}, []);
  const [date, setDate] = React.useState<Date | undefined>(today);
 const [month, setMonth] = React.useState<Date>(today);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<string | null>(null);

  const availableSlots = getSlots(date);
  const hasSlots = availableSlots && availableSlots.length > 0;
  
  // Logic: Only show price if date is selected AND slots exist
  const currentPrice = (date && hasSlots) ? getPrice(date) : null;

  const formattedPrice = currentPrice 
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(currentPrice)
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: PROFILE */}
          <div className="lg:col-span-7 space-y-8 md:space-y-10 order-2 lg:order-1">
            <header className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur opacity-25" />
                <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white dark:border-slate-900 shadow-2xl relative">
                  <AvatarImage src={instructor.profileUrl} className="object-cover" />
                  <AvatarFallback className="text-2xl font-black">{instructor.name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-4 min-w-0 w-full">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic truncate">
                      {instructor.name}
                    </h1>
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500 shrink-0" />
                  </div>
                  <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent truncate">
                    {instructor.title} <span className="text-slate-400 font-medium">@</span> {instructor.companyName}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                  <StatItem icon={<Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />} label={instructor.rating} />
                  <StatItem icon={<Briefcase className="w-3.5 h-3.5 text-blue-500" />} label={`${instructor.experience}y Exp`} />
                  <StatItem icon={<Users className="w-3.5 h-3.5 text-indigo-500" />} label={`${instructor.totalSessions} Sessions`} />
                </div>
              </div>
            </header>

            <div className="space-y-8 md:space-y-10 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/20 dark:border-slate-800/50 shadow-sm overflow-hidden">
              <section className="max-w-full">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> About Instructor
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm md:text-base whitespace-pre-wrap break-words">
                  {instructor.bio}
                </p>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4 text-center md:text-left">Offerings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {instructor.typesOfSessions?.map((type: string) => (
                    <div key={type} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500/30">
                      <div className="p-2 bg-blue-600/10 rounded-lg text-blue-600">
                         <Video className="w-4 h-4" />
                      </div>
                      <span className="text-xs md:text-sm font-black text-slate-700 dark:text-slate-200 uppercase">{type}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING SIDEBAR */}
          <aside className="lg:col-span-5 w-full order-1 lg:order-2">
            <Card className="lg:sticky lg:top-8 overflow-hidden border-none shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] bg-white dark:bg-slate-900">
              <div className="bg-slate-900 dark:bg-blue-600 p-6 md:p-8 text-white transition-all duration-500">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">Reserve</h2>
                  {formattedPrice && (
                    <div className="text-right animate-in fade-in slide-in-from-right-4">
                      <p className="text-xl md:text-2xl font-black tracking-tighter">{formattedPrice}</p>
                      <p className="text-[8px] font-bold opacity-50 uppercase tracking-[0.2em]">Current rate</p>
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-5 md:p-8 space-y-6 md:space-y-8">
                {/* 1. Date */}
                <div className="space-y-3">
                  <LabelStep number="1" title="Select Date" icon={<CalendarIcon className="w-4 h-4" />} />
                  <div className={`transition-all duration-300 rounded-[2.5rem] p-4 border-2 shadow-inner
                    ${date 
                      ? 'bg-blue-50/30 dark:bg-blue-900/10 border-blue-500/50 shadow-blue-500/10 ring-4 ring-blue-500/5' 
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800'
                    }`}>
          <Calendar
  mode="single"
  selected={date}
  month={month}           // Controls which month is visible
  onMonthChange={setMonth} // Updates view when clicking arrows
  onSelect={(d) => {
    if (!d) return;
    d.setHours(0, 0, 0, 0);
    setDate(d);
    setMonth(d); // Jumps view to selected date
    setSelectedSlot(null);
  }}
  disabled={(d) => d < today}
/>

                  </div>
                </div>

                {/* 2. Session Type */}
                <div className="space-y-3">
                  <LabelStep number="2" title="Session Type" icon={<Video className="w-4 h-4" />} />
                  <div className="grid grid-cols-1 gap-2">
                    {instructor.typesOfSessions?.map((type: string) => (
                      <button
                        key={type}
                        onClick={() => setSelectedSessionType(type)}
                        className={`flex items-center justify-between p-4 rounded-2xl text-left border-2 transition-all
                          ${selectedSessionType === type 
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 text-blue-600' 
                            : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                        {selectedSessionType === type && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Time Slots & Price logic */}
               {/* Step 3: Time Slot Grid */}
<div className="grid grid-cols-2 gap-2 md:gap-3">
  {availableSlots.length > 0 ? (
    availableSlots.map((slot: { time: string; isAvailable: boolean }) => {
      const isSelected = selectedSlot === slot.time;
      const isBooked = !slot.isAvailable;

      return (
        <button
          key={slot.time}
          disabled={isBooked}
          onClick={() => setSelectedSlot(slot.time)}
          className={`
            relative py-3 md:py-4 px-2 rounded-2xl font-black text-[10px] transition-all border-2 flex flex-col items-center justify-center overflow-hidden group
            ${isBooked 
              ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed' 
              : isSelected 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02] z-10' 
                : 'bg-white dark:bg-slate-950 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/10'
            }
          `}
        >
          <span className={`
            tracking-tight transition-transform duration-200
            ${isBooked ? 'line-through opacity-50' : ''}
            ${isSelected ? 'scale-110' : ''}
          `}>
            {slot.time}
          </span>
          
          <div className="flex items-center gap-1.5 mt-1">
            {/* Status Indicator Dot */}
            <div className={`
              w-1 h-1 rounded-full transition-colors
              ${isBooked ? 'bg-slate-400' : isSelected ? 'bg-white' : 'bg-emerald-500 animate-pulse'}
            `} />
            
            <span className={`
              text-[7px] uppercase tracking-tighter font-black italic
              ${isBooked ? 'text-slate-400' : isSelected ? 'text-blue-100' : 'text-emerald-500'}
            `}>
              {isBooked ? "Sold Out" : isSelected ? "Selected" : "Available"}
            </span>
          </div>

          {/* Background Glow for available slots */}
          {!isBooked && !isSelected && (
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}
        </button>
      );
    })
  ) : (
    <div className="col-span-2 py-10 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
       <div className="flex flex-col items-center gap-2">
         <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
            <AlertCircle className="w-4 h-4 text-slate-400" />
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-[0.2em]">No slots scheduled</p>
       </div>
    </div>
  )}
</div>
                {/* Action Button */}
                <Button 
                  onClick={() => onBook(date, selectedSlot, selectedSessionType, currentPrice)}
                  disabled={!selectedSlot || !selectedSessionType || isBookingLoading}
                  className={`w-full h-16 md:h-20 rounded-[1.8rem] md:rounded-[2.2rem] font-black transition-all duration-300 flex flex-col items-center justify-center gap-1
                    ${selectedSlot && selectedSessionType 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                >
                  {isBookingLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                      <span className="text-base md:text-lg tracking-tight uppercase italic">Confirm Booking</span>
                      {formattedPrice && (
                        <span className="text-[9px] opacity-70 font-bold uppercase tracking-[0.2em]">Total {formattedPrice}</span>
                      )}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

// Internal Helpers
const StatItem = ({ icon, label }: { icon: React.ReactNode, label: any }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
    {icon}
    <span className="text-[10px] md:text-xs font-black text-slate-700 dark:text-slate-300">{label}</span>
  </div>
);

const LabelStep = ({ number, title, icon }: { number: string, title: string, icon: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black">{number}</span>
    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
      {icon} {title}
    </span>
  </div>
);

export default InstructorBookingPage;