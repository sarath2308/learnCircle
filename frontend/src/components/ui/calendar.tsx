import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...defaultClassNames,
        months: "flex flex-col relative",
        month: "space-y-4 w-full",
        
        // CAPTION: Centered, Bold, Italic
        month_caption: "flex justify-center pt-1 relative items-center text-sm font-black uppercase tracking-tighter italic pb-4",
        caption_label: "text-sm font-black text-slate-900 dark:text-white",
        
        // NAVIGATION
        nav: "flex items-center justify-between absolute inset-x-0 top-1 px-2 z-10",
        button_previous: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity border-none flex items-center justify-center cursor-pointer",
        button_next: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity border-none flex items-center justify-center cursor-pointer",
        
        table: "w-full border-collapse",
        
        // THE FIX: Use Grid to ensure perfect column alignment
        weekdays: "grid grid-cols-7 w-full", 
        weekday: "text-slate-400 font-black uppercase text-[10px] h-10 flex items-center justify-center",
        
        week: "grid grid-cols-7 w-full mt-2",
        day: "relative p-0 text-center text-sm flex items-center justify-center",
        
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          return orientation === "left" ? (
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          ) : (
            <ChevronRight className="h-5 w-5 text-slate-900 dark:text-white" />
          );
        },
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  day,
  modifiers,
  className,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        // BASE STYLE: Perfect 1:1 Aspect Ratio
        "h-10 w-10 p-0 font-bold rounded-xl transition-all text-xs flex items-center justify-center border-none cursor-pointer",
        "hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-900 dark:text-slate-300",
        
        modifiers.today && !modifiers.selected && "bg-slate-200/50 dark:bg-slate-800/50 text-blue-600",
        
        modifiers.selected && [
          "bg-gradient-to-tr from-blue-600 to-indigo-500 !text-white",
          "rounded-xl shadow-lg shadow-blue-500/30 font-black scale-110 z-10 !opacity-100"
        ],
        
        modifiers.disabled && "cursor-not-allowed opacity-10",
        modifiers.outside && "opacity-30",
        className
      )}
    >
      {day.date.getDate()}
    </button>
  );
}

export { Calendar }