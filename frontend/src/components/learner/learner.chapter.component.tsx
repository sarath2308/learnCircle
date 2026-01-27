"use client";

import { 
  BookOpen, 
  Clock, 
  ChevronDown 
} from "lucide-react";
import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent, 
  Accordion
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import LearnerLessonItem from "./learner.lesson.component";
import type { ILessons } from "@/interface/lesson.response.interface";
import type { LearnerLessonResponseType } from "@/hooks/learner/course/learner.course.get.hook";

interface LearnerChapterProps {
  chapter: {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: LearnerLessonResponseType[];
  };
  onLessonSelect:(lesson: LearnerLessonResponseType) => void;
  activeLessonId?: string;
  // In a real app, pass progress data here
  completedLessonIds?: string[]; 
}

const LearnerChapterItem = ({ 
  chapter, 
  activeLessonId, 
  completedLessonIds = [],
  onLessonSelect, 
}: LearnerChapterProps) => {
  
  const hasActiveLesson = chapter.lessons?.some(l => l.id === activeLessonId);
  const completedCount = chapter.lessons?.filter(l => completedLessonIds.includes(l.id)).length || 0;
  const totalLessons = chapter.lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="mb-4">
      <Accordion type="multiple">
      <AccordionItem 
        value={chapter.id} 
        className={cn(
          "border rounded-2xl overflow-hidden transition-all duration-300",
          hasActiveLesson 
            ? "border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/5 shadow-sm" 
            : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-200"
        )}
      >
        <AccordionTrigger className="flex-1 hover:no-underline py-5 px-5 group">
          <div className="flex items-start gap-5 text-left">
            {/* Section Index Badge */}
            <div className={cn(
              "flex flex-col items-center justify-center h-12 w-12 shrink-0 rounded-2xl font-black transition-all border-2",
              hasActiveLesson 
                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-none" 
                : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
            )}>
              <span className="text-[9px] uppercase tracking-tighter opacity-60">Sec</span>
              {chapter.order}
            </div>

            {/* Title and Meta */}
            <div className="space-y-1 pr-4">
              <h3 className={cn(
                "text-base font-bold tracking-tight transition-colors",
                hasActiveLesson ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"
              )}>
                {chapter.title}
              </h3>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                {chapter.description || "Learn the fundamentals of this section."}
              </p>

              <div className="flex items-center gap-3 pt-1">
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <BookOpen size={12} className="text-indigo-500/70" />
                    {totalLessons} Lessons
                 </div>
                 <span className="text-slate-200 dark:text-slate-800">•</span>
                 <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} className="text-emerald-500/70" />
                    {totalLessons * 5} Mins {/* Logic: Average 5 mins per lesson if duration missing */}
                 </div>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pb-4 px-5">
          {/* Progress Visual - Only show if there's actual progress */}
          <div className="mb-4 flex items-center justify-between px-1">
             <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
               Chapter Completion
             </span>
             <div className="flex items-center gap-3">
               <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  />
               </div>
               <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">
                 {Math.round(progressPercentage)}%
               </span>
             </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-1">
            {chapter.lessons?.map((lesson,i) => (
              <LearnerLessonItem 
                key={i} 
                lesson={lesson} 
                isActive={activeLessonId === lesson.id}
                isCompleted={completedLessonIds.includes(lesson.id)}
                isLocked={false} // You can pass your locking logic here
                onSelect={onLessonSelect}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LearnerChapterItem;