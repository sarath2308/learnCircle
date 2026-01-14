"use client";

import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import type { ILessons } from "@/interface/lesson.response.interface";
import { 
  Pencil, 
  Trash2, 
  PlayCircle, 
  FileText, 
  Link, 
  Youtube, 
  ExternalLink,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ILessonProps {
  lesson: ILessons;
  setModalData: (data: { type: string; url?: string }) => void;
  variant?: "creator" | "admin" | "user";
}

const LessonItem = ({ lesson, setModalData, variant = "user" }: ILessonProps) => {
  
  // Dynamic Icon mapping for better UX
  const getIcon = () => {
    switch (lesson.type) {
      case LESSON_TYPES.VIDEO: return <PlayCircle className="text-blue-500" size={18} />;
      case LESSON_TYPES.YOUTUBE: return <Youtube className="text-red-500" size={18} />;
      case LESSON_TYPES.PDF: return <FileText className="text-orange-500" size={18} />;
      case LESSON_TYPES.ARTICLE: return <Link className="text-emerald-500" size={18} />;
      default: return <ExternalLink className="text-slate-400" size={18} />;
    }
  };

  const handleOpenResource = () => {
    switch (lesson.type) {
      case LESSON_TYPES.VIDEO:
      case LESSON_TYPES.PDF:
        return setModalData({ type: lesson.type, url: lesson.fileUrl });
      case LESSON_TYPES.ARTICLE:
      case LESSON_TYPES.YOUTUBE:
        return setModalData({ type: lesson.type, url: lesson.link });
      case LESSON_TYPES.BLOG:
        return window.open(lesson.link, "_blank");
      default:
        console.warn("Unknown resource type");
    }
  };

  return (
    <div className="group flex items-center justify-between p-3 mb-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all shadow-sm hover:shadow-md">
      
      {/* Left Section: Visuals & Info */}
      <div className="flex items-center gap-4 flex-1">
        {variant === "creator" && (
          <GripVertical size={16} className="text-slate-300 dark:text-slate-700 cursor-grab active:cursor-grabbing" />
        )}
        
        <div className="relative h-12 w-12 shrink-0 group/thumb">
          <img
            src={lesson.thumbnailUrl || "/lesson-placeholder.png"}
            alt={lesson.title}
            className="h-full w-full rounded-lg object-cover border border-slate-100 dark:border-slate-800"
          />
          <button 
            onClick={handleOpenResource}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity rounded-lg text-white"
          >
            <PlayCircle size={20} />
          </button>
        </div>

        <div className="flex flex-col overflow-hidden">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate tracking-tight">
            {lesson.title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            {getIcon()}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {lesson.type}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Creator Actions */}
      {variant === "creator" && (
        <div className="flex items-center gap-1 pl-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => console.log("Edit", lesson)}
                >
                  <Pencil size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Lesson</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => console.log("Delete", lesson.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove Lesson</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default LessonItem;