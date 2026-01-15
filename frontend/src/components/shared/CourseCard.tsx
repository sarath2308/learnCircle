"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  BarChart3, 
  PlayCircle, 
  MoreVertical, 
  Calendar,
  Layers
} from "lucide-react";

type CourseStatus = "draft" | "published" | "pending" | "rejected";

interface Course {
  id: string;
  title: string;
  thumbnail?: string | null;
  price?: number | null;
  type?: "Free" | "Paid";
  status?: CourseStatus;
  progress?: number;
  createdAt: string;
  duration?: string;
  skillLevel: string;
  level?: string;
  lessonsCount?: number;
}

interface CourseCardProps {
  course: Course;
  variant: 'admin' | 'user' | 'creator';
  onEdit?: (id: string) => void;
  onPublish?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function CourseCard({
  course,
  variant,
  onEdit,
  onPublish,
  onView,
}: CourseCardProps) {
  
  // Status Color Logic
  const statusConfig = {
    draft: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div 
      onClick={() => onView?.(course.id)}
      className="group relative flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
    >
      {/* 1. Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={course.thumbnail || "/course-placeholder.webp"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
           <Button size="sm" className="w-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-black font-bold rounded-lg transition-all">
             Quick View
           </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={`uppercase text-[10px] font-black tracking-wider px-2 border-none shadow-sm ${statusConfig[course.status || "draft"]}`}>
            {course.status}
          </Badge>
        </div>

        <Badge className={`absolute top-3 right-3 font-bold border-none shadow-md ${
          course.type === "Free" ? "bg-blue-600 text-white" : "bg-amber-500 text-white"
        }`}>
          {course.type === "Paid" ? `$${course.price || '0'}` : "FREE"}
        </Badge>
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
        </div>

        {/* Course Meta Info */}
        <div className="grid grid-cols-2 gap-y-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <PlayCircle size={14} className="text-blue-500" />
            <span className="text-xs font-medium">{course.lessonsCount || 0} Lessons</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Clock size={14} className="text-purple-500" />
            <span className="text-xs font-medium">{course.duration || "3h 0m"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Layers size={14} className="text-orange-500" />
            <span className="text-xs font-medium">{course?.skillLevel || "All Levels"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Calendar size={14} className="text-green-500" />
            <span className="text-xs font-medium">
              {new Date(course.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* 3. Action Footer */}
        {(variant === 'creator' || course.status === "draft") && (
          <div className="mt-5 pt-4 flex gap-2">
            {course.status === "draft" && onPublish && (
              <Button 
                onClick={(e) => { e.stopPropagation(); onPublish(course.id); }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl h-10 shadow-md shadow-green-100 dark:shadow-none"
              >
                Publish
              </Button>
            )}
            {onEdit && (
              <Button 
                variant="outline"
                onClick={(e) => { e.stopPropagation(); onEdit(course.id); }}
                className="flex-1 border-slate-200 dark:border-slate-700 font-bold rounded-xl h-10 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white"
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}