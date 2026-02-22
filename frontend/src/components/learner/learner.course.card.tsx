"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, BookOpen, Heart } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";
import type { ILearnerHomeCourseType } from "@/pages/Learner/LearnerHome";
import { useState, useEffect } from "react";

interface CourseCardProps {
  course: ILearnerHomeCourseType;
}

export function CourseDiscoveryCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Logical check for touch/mobile devices to prevent HoverCard issues
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is standard for "Laptop" breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const originalPrice = course.price ?? 0;
  const discountPercent = course.discount ?? 0;
  const isFree = course.type === "Free";
  const hasDiscount = !isFree && discountPercent > 0;

  const offerPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  const savings = originalPrice - offerPrice;

  const handleCourseView = () => {
    navigate(`/learner/course/${course.id}`);
  };

  // Main Card Content (Used in both Hover Trigger and Mobile View)
  const CardBase = (
    <div
      onClick={handleCourseView}
      className="group relative flex flex-col w-full cursor-pointer bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden rounded-xl transition-all hover:shadow-xl active:scale-[0.98] lg:active:scale-100"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={course.thumbnailUrl || "/placeholder.jpg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          <Badge className="bg-white/95 dark:bg-slate-900/95 text-blue-600 dark:text-blue-400 border-none text-[9px] font-black px-2 shadow-sm uppercase tracking-tighter">
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

      <div className="flex flex-col flex-1 p-3 sm:p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
            {course.skillLevel}
          </span>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-200">
              {course.averageRating || 0}
            </span>
          </div>
        </div>

        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 h-9">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 pt-1">
          {isFree ? (
            <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
              Complimentary
            </span>
          ) : (
            <>
              <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
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
  );

  // If mobile, return just the card. If desktop, wrap in HoverCard.
  if (isMobile) {
    return CardBase;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>{CardBase}</HoverCardTrigger>

      <HoverCardContent
        side="right"
        align="start"
        className="hidden lg:block z-[100] w-[340px] p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="relative aspect-video w-full">
          <img src={course.thumbnailUrl} className="h-full w-full object-cover" alt="preview" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button variant="secondary" className="rounded-full gap-2">
              <BookOpen size={16} /> Preview Course
            </Button>
          </div>
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

          <div className="border-t border-b border-slate-100 dark:border-slate-800 py-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Course Price</span>
              {isFree ? (
                <Badge className="text-xs font-bold text-white bg-green-500">Free</Badge>
              ) : (
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ${originalPrice}
                </span>
              )}
            </div>
            {hasDiscount && (
              <>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-red-500">Discount ({discountPercent}%)</span>
                  <span className="text-red-500">-${savings}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    Payable amount
                  </span>
                  <span className="text-lg font-black text-green-500 dark:text-blue-400">
                    ${offerPrice}/-
                  </span>
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {course.description}
          </p>

          <div className="flex gap-3 pt-1">
            <Button
              onClick={handleCourseView}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 font-black text-sm h-12 rounded-xl shadow-md"
            >
              {isFree ? "ENROLL FREE" : "PURCHASE NOW"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-200 dark:border-slate-800 h-12 w-12 rounded-xl"
            >
              <Heart
                size={20}
                className="text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
              />
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
