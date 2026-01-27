"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, BookOpen, Check, PlayCircle, Heart, Tag } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { ILearnerHomeCourseType } from "@/pages/Learner/LearnerHome";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: ILearnerHomeCourseType;
}

export function CourseDiscoveryCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const originalPrice = course.price ?? 0;
  const discountPercent = course.discount ?? 0;
  const isFree = course.type === "Free";
  const hasDiscount = !isFree && discountPercent > 0;
  
  const offerPrice = hasDiscount 
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  const savings = originalPrice - offerPrice;

  const handleCourseView = ()=>
  {
    navigate(`/learner/course/${course.id}`)
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="group relative flex flex-col w-full cursor-pointer bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl transition-all hover:shadow-lg">
          
          {/* Thumbnail & Contextual Badges */}
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={course.thumbnailUrl || "/placeholder.jpg"}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              <Badge className="bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 border-none text-[9px] font-black px-2 shadow-sm uppercase tracking-tighter">
                {course.category?.name || "General"}
              </Badge>
              {isFree ? (
                <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black px-2 shadow-sm">
                  FREE
                </Badge>
              ) : hasDiscount ? (
                <Badge className="bg-red-600 text-white border-none text-[10px] font-black px-2 shadow-sm">
                  {discountPercent}% OFF
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Card Body */}
          <div className="flex flex-col flex-1 p-4 space-y-2">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400  tracking-widest">
                {course.skillLevel}
              </span>
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">{course.averageRating || 0}</span>
              </div>
            </div>

            <h3 className="line-clamp-2 text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 h-9">
              {course.title}
            </h3>

            {/* Price Highlight: Clear & Bold */}
            <div className="flex items-center gap-2 pt-1">
              {isFree ? (
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">Complimentary</span>
              ) : (
                <>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    ${offerPrice}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      ${originalPrice}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </HoverCardTrigger>

      {/* Hover Card */}
      <HoverCardContent 
        side="right" 
        align="start" 
        className="z-[100] w-[340px] p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="relative aspect-video w-full">
          <img src={course.thumbnailUrl} className="h-full w-full object-cover" alt="preview" />
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
              {course.title}
            </h4>
            <div className="flex flex-wrap gap-2">
               <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-none text-[10px] font-bold">
                <BookOpen size={12} className="mr-1" /> {course.chapterCount} Chapters
               </Badge>
               <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none text-[10px] font-bold">
                <Clock size={12} className="mr-1" /> {course.totalDuration}m
               </Badge>
            </div>
          </div>

          {/* Pricing Destruction */}
          <div className="border-t border-b border-slate-100 dark:border-slate-800 py-3 space-y-1">
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Course Price</span>
                {isFree?( <Badge className="text-xs font-bold text-white dark:text-white bg-green-500">
                  Free
                </Badge>):(<span className="text-xs font-bold text-slate-900 dark:text-white">
                  ${originalPrice}
                </span>)}
            
             </div>
             {hasDiscount && (
               <>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-red-500">Discount ({discountPercent}%)</span>
                    <span className="text-xs font-bold text-red-500">-${savings}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-black text-slate-900 dark:text-white">Payable amount</span>
                    <span className="text-lg font-black text-green-400 dark:text-blue-400">${offerPrice}/-</span>
                </div>
               </>
             )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          <div className="flex gap-3 pt-1">
            {/* High Contrast Button Fix */}
            <Button  onClick={handleCourseView} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-black text-sm h-12 rounded-xl shadow-md">
              {isFree ? "ENROLL FREE" : "PURCHASE NOW"}
            </Button>
            <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-800 h-12 w-12 rounded-xl">
              <Heart size={20} className="text-slate-500 dark:text-slate-400" />
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}