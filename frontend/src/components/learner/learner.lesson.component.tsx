import { PlayCircle, FileText, CheckCircle2, Lock, Circle, Clock } from "lucide-react";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import { cn } from "@/lib/utils";
import type { LearnerLessonResponseType } from "@/hooks/learner/course/learner.course.get.hook";
import toast from "react-hot-toast";

interface ILearnerLessonProps {
  lesson: LearnerLessonResponseType;
  isActive: boolean;
  isLocked: boolean;
  isCompleted: boolean;
  onSelect: (lesson: LearnerLessonResponseType) => void;
}

const LearnerLessonItem = ({
  lesson,
  isActive,
  isLocked,
  isCompleted,
  onSelect,
}: ILearnerLessonProps) => {
  const getIcon = () => {
    if (isLocked) return <Lock size={16} className="text-slate-400 dark:text-slate-600" />;
    if (isCompleted) return <CheckCircle2 size={18} className="text-emerald-500" />;

    // Default icons based on type for unlocked/uncompleted
    switch (lesson.type) {
      case LESSON_TYPES.VIDEO:
      case LESSON_TYPES.YOUTUBE:
        return <PlayCircle size={18} className={isActive ? "text-indigo-500" : "text-slate-400"} />;
      case LESSON_TYPES.PDF:
        return <FileText size={18} className="text-orange-500" />;
      default:
        return <Circle size={18} className="text-slate-300" />;
    }
  };

  return (
    <div
      onClick={() => !isLocked && onSelect(lesson)}
      className={cn(
        "group relative flex items-center justify-between p-4 mb-2 rounded-xl transition-all duration-200 cursor-pointer border",
        // Active State
        isActive
          ? "bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30"
          : "bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600",
        // Locked State
        isLocked && "opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-950",
      )}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 rounded-r-full" />
      )}

      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="shrink-0">{getIcon()}</div>

        <div className="flex flex-col min-w-0">
          <h4
            className={cn(
              "text-sm font-bold truncate tracking-tight transition-colors",
              isActive
                ? "text-indigo-900 dark:text-indigo-300"
                : "text-slate-700 dark:text-slate-200",
              isCompleted && "text-slate-500 dark:text-slate-400",
            )}
          >
            {lesson.title}
          </h4>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {lesson.type}
            </span>
            {lesson && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                  <Clock size={10} />
                  50minute
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Completion Indicator for Non-Active items */}
      {!isActive && !isLocked && isCompleted && (
        <div className="ml-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      )}
    </div>
  );
};

export default LearnerLessonItem;
