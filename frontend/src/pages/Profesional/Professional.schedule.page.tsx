import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  CalendarOff,
  ChevronDown,
  Loader2,
  AlertCircle,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useCreateAvailability } from "@/hooks/profesional/availability/availability.create.hook";
import { useAvailabilityRemove } from "@/hooks/profesional/availability/availability.remove.hook";
import { useGetAvailabilityRecords } from "@/hooks/profesional/availability/availability.get.rules.hook";
import {
  useGetException,
  type IGetException,
} from "@/hooks/profesional/availability/exception/exception.get.hook";
import { useCreateException } from "@/hooks/profesional/availability/exception/exception.create.hook";
import { useRemoveException } from "@/hooks/profesional/availability/exception/exception.remove.hook";

type DayName = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
const DAYS: DayName[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DURATIONS = [15, 30, 45, 60, 90, 120];

interface AvailabilityRecord {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  price: number;
}

export default function AvailabilityManager() {
  // API Hooks
  const { data: availabilityRes, isLoading: isApiLoading } = useGetAvailabilityRecords();
  const {
    data: exceptionRes,
    isLoading: isExcLoading,
    refetch: refetchException,
  } = useGetException();

  const createAvailability = useCreateAvailability();
  const removeAvailability = useAvailabilityRemove();
  const createException = useCreateException();
  const removeException = useRemoveException();

  // LOCAL STATE
  const [records, setRecords] = useState<AvailabilityRecord[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Form States
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState(30);
  const [price, setPrice] = useState("");
  const [exceptionDate, setExceptionDate] = useState("");

  useEffect(() => {
    if (availabilityRes?.availabilityData) {
      setRecords(availabilityRes.availabilityData);
    }
  }, [availabilityRes]);

  const toMinutes = (t: string) => t.split(":").reduce((h, m) => Number(h) * 60 + Number(m), 0);

  // --- HANDLERS ---

  const handleAddAvailability = async () => {
    setLocalError(null);
    const s = toMinutes(startTime);
    const e = toMinutes(endTime);

    if (selectedDays.length === 0) return setLocalError("Select at least one day.");
    if (!price || Number(price) <= 0) return setLocalError("Invalid price.");
    if (s >= e) return setLocalError("End time must be after start time.");

    for (const day of selectedDays) {
      if (
        records.find(
          (r) => r.dayOfWeek === day && s < toMinutes(r.endTime) && e > toMinutes(r.startTime),
        )
      ) {
        return setLocalError(`Conflict: Overlap exists on ${DAYS[day]}`);
      }
    }

    try {
      const response = await createAvailability.mutateAsync({
        daysOfWeek: selectedDays,
        startTime,
        endTime,
        slotDuration,
        price: Number(price),
      });

      if (response?.availabilityData) {
        const newRecords = Array.isArray(response.availabilityData)
          ? response.availabilityData
          : [response.availabilityData];
        setRecords((prev) => [...prev, ...newRecords]);
      }
      setSelectedDays([]);
      setPrice("");
    } catch (err: any) {
      setLocalError(err.message || "Failed to save schedule.");
    }
  };

  const handleAddException = async () => {
    if (!exceptionDate) return;
    try {
      const isoDate = new Date(exceptionDate).toISOString();
      await createException.mutateAsync(isoDate);
      setExceptionDate("");
      refetchException();
    } catch (err: any) {
      setLocalError(err.message || "Failed to add leave date.");
    }
  };

  const handleRemoveException = async (id: string) => {
    try {
      await removeException.mutateAsync(id);
      refetchException();
    } catch (err: any) {
      setLocalError("Failed to remove exception.");
    }
  };
  const handleRemove = async (id: string) => {
    // OPTIMISTIC UPDATE: Remove from UI immediately

    const previousRecords = [...records];

    setRecords((prev) => prev.filter((r) => r.id !== id));

    try {
      await removeAvailability.mutateAsync(id);
    } catch (err) {
      // ROLLBACK: If API fails, put the record back

      setRecords(previousRecords);

      setLocalError("Failed to delete. Reverting UI...");
    }
  };

  // Helper to get today's date for input 'min' attribute
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-12 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight uppercase italic">
            Availability Engine
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
            Manage weekly rules and specific leaves
          </p>
        </header>

        {localError && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-2 items-center">
              <AlertCircle size={14} /> {localError}
            </div>
            <button onClick={() => setLocalError(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Weekly Schedule Form & Rules */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-4">
                <Plus size={20} className="text-blue-600" />
                <h2 className="font-bold text-xs uppercase tracking-widest">Weekly Recurrence</h2>
              </div>

              {/* Day Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Select Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day, i) => {
                    const hasData = records.some((r) => r.dayOfWeek === i);
                    const isSelected = selectedDays.includes(i);
                    return (
                      <button
                        key={day}
                        onClick={() =>
                          setSelectedDays((prev) =>
                            isSelected ? prev.filter((x) => x !== i) : [...prev, i],
                          )
                        }
                        className={`relative h-14 w-[calc(33%-0.5rem)] md:w-20 rounded-2xl border-2 font-black text-xs transition-all flex flex-col items-center justify-center 
                          ${isSelected ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-transparent border-slate-100 dark:border-slate-800 hover:border-blue-400"}`}
                      >
                        <span>{day}</span>
                        {hasData && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-white" : "bg-blue-600 animate-pulse"}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Time Window
                  </label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-1">
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-transparent p-3 text-sm font-bold outline-none"
                    />
                    <span className="text-slate-300">—</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-transparent p-3 text-sm font-bold outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Slot Duration
                  </label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-blue-500 transition-all"
                  >
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d} Minutes
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                onClick={handleAddAvailability}
                disabled={createAvailability.isPending}
                className="w-full bg-slate-900 dark:bg-blue-600 text-white font-black py-5 rounded-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
              >
                {createAvailability.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "COMMIT TO SCHEDULE"
                )}
              </button>
            </section>

            {/* List of Rules */}
            <section className="space-y-4">
              <h3 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest px-2">
                Active Rules
              </h3>
              <div className="grid gap-3">
                {isApiLoading && records.length === 0 && (
                  <Loader2 className="animate-spin mx-auto text-blue-600" />
                )}
                {records.length === 0 && !isApiLoading && (
                  <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 font-bold text-sm uppercase">
                    No active rules
                  </div>
                )}
                {[...records]
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl flex justify-between items-center shadow-sm hover:border-blue-300 transition-all"
                    >
                      <div className="flex gap-5 items-center">
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-4 py-1.5 rounded-xl font-black text-[10px] min-w-16 text-center uppercase tracking-tighter">
                          {DAYS[r.dayOfWeek]}
                        </div>
                        <div>
                          <p className="font-black text-sm">
                            {r.startTime} — {r.endTime}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500">
                            {r.slotDuration}m slots • ₹{r.price}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(r.id)}
                        className="p-2 text-slate-300 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Exceptions / Leaves */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-4">
                <CalendarOff size={18} className="text-orange-500" />
                <h2 className="font-bold text-xs uppercase tracking-widest">Date Exceptions</h2>
              </div>

              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                Add specific dates where you are unavailable (Leaves/Holidays).
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={exceptionDate}
                    onChange={(e) => setExceptionDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-orange-500 transition-all appearance-none"
                  />
                  <CalendarIcon
                    className="absolute right-4 top-4 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>

                <button
                  onClick={handleAddException}
                  disabled={!exceptionDate || createException.isPending}
                  className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createException.isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    "MARK AS LEAVE"
                  )}
                </button>
              </div>

              {/* Exception List */}
              <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                <h4 className="text-[10px] font-black text-slate-400 uppercase">Upcoming Leaves</h4>
                {isExcLoading && (
                  <Loader2 className="animate-spin mx-auto text-orange-500" size={18} />
                )}

                {exceptionRes?.exceptionData?.length === 0 && (
                  <div className="text-[10px] text-center py-4 text-slate-400 font-bold uppercase">
                    No leaves scheduled
                  </div>
                )}

                {exceptionRes?.exceptionData?.map((exc: IGetException) => (
                  <div
                    key={exc.id}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <CalendarOff size={12} className="text-orange-600" />
                      </div>
                      <span className="text-xs font-black tracking-tight">
                        {new Date(exc.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveException(exc.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
