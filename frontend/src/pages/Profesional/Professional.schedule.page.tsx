import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Edit2, 
  CalendarOff, 
  ChevronDown,
  Info
} from 'lucide-react';

// --- Types ---
type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

interface AvailabilityRule {
  id: string;
  days: Day[];
  startTime: string;
  endTime: string;
  duration: string;
  price: string;
}

const DAYS: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DURATIONS = ['15 min', '30 min', '45 min', '60 min'];

export default function AvailabilityManager() {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [duration, setDuration] = useState('60 min');
  const [price, setPrice] = useState('');

  // --- Handlers ---
  const toggleDay = (day: Day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const addRule = () => {
    if (selectedDays.length === 0 || !price) return;
    
    const newRule: AvailabilityRule = {
      id: crypto.randomUUID(),
      days: [...selectedDays],
      startTime,
      endTime,
      duration,
      price,
    };

    setRules([...rules, newRule]);
    // Reset selection for next entry
    setSelectedDays([]);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-12 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Set Weekly Availability</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm">
            <Info size={16} />
            Choose days and time ranges you're available every week.
          </p>
        </header>

        {/* Configuration Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            
            {/* Day Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                      ${selectedDays.includes(day) 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' 
                        : 'bg-transparent border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Inputs */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Time Range (24h)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                  <span className="text-slate-400">—</span>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>

              {/* Slot Duration */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Slot Duration</label>
                <div className="relative">
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-slate-400" size={18} />
                </div>
              </div>
            </div>

            {/* Price Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Price (INR)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-medium">₹</span>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 pl-8 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={addRule}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Availability
            </button>
          </div>
        </section>

        {/* Schedule List */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Your Weekly Schedule</h2>
          
          {rules.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center">
              <p className="text-slate-400 italic">No availability set yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between group">
                  <div className="space-y-1">
                    <div className="flex gap-2 items-center">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{rule.days.join(', ')}</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="text-sm font-medium">{rule.startTime} - {rule.endTime}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex gap-3">
                      <span>{rule.duration} slots</span>
                      <span>₹{rule.price} per session</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Block Dates - Secondary Action */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
            <CalendarOff size={18} />
            Need to block specific dates? <span className="underline decoration-2 underline-offset-4">Manage Overrides</span>
          </button>
        </div>

      </div>
    </div>
  );
}