"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, BarChart3, Lock, PlayCircle } from "lucide-react";

type CourseStatus = "draft" | "published" | "pending";

interface Course {
  id: string;
  title: string;
  thumbnail?: string | null;
  price?: number | null;
  isFree?: boolean;
  status?: CourseStatus;
  progress?: number;
  duration?: string;      // optional - "12h 30m"
  level?: string;         // optional - "Beginner" | "Intermediate"
  lessonsCount?: number;
}

interface CourseCardProps {
  course: Course;
  variant: "admin" | "user";
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
  const isFree = 0;

  return (
    <Card 
      className={`
        group overflow-hidden border bg-card transition-all duration-300
        hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1
        ${variant === "user" ? "hover:border-primary/40" : ""}
      `}
    >
      {/* === Image + overlay badges === */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-b from-slate-900/20 to-black/60">
        <img
          src={course.thumbnail || "/course-placeholder.webp"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          <div className="flex gap-2">
            {isFree && (
              <Badge 
                variant="secondary" 
                className="bg-emerald-500/90 hover:bg-emerald-500 text-white font-medium"
              >
                FREE
              </Badge>
            )}
            {course.price != null && course.price > 0 && (
              <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
                ₹{course.price.toLocaleString()}
              </Badge>
            )}
          </div>

          {variant === "admin" && course.status && (
            <Badge 
              variant="outline"
              className={`
                backdrop-blur-sm border capitalize
                ${course.status === "published" 
                  ? "bg-green-500/20 text-green-300 border-green-500/40" 
                  : course.status === "pending" 
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-700/60 text-slate-300 border-slate-500/40"
                }
              `}
            >
              {course.status}
            </Badge>
          )}
        </div>

        {/* Progress overlay for user variant */}
        {variant === "user" && typeof course.progress === "number" && course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-4">
        <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.8rem] group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {course.lessonsCount && (
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{course.lessonsCount} lessons</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{course.duration}</span>
            </div>
          )}
          {course.level && (
            <div className="flex items-center gap-1">
              <BarChart3 size={14} />
              <span>{course.level}</span>
            </div>
          )}
        </div>

        {/* Buttons area */}
        <div className="pt-3">
          {variant === "admin" ? (
            <div className="flex gap-3">
              {course.status === "draft" && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onEdit?.(course.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={() => onPublish?.(course.id)}
                  >
                    Publish Now
                  </Button>
                </>
              )}

              {course.status === "published" && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onView?.(course.id)}
                >
                  View Course
                </Button>
              )}
            </div>
          ) : (
            // ── User variant ──
            <Button
              className={`
                w-full gap-2 font-medium transition-all
                ${course.progress === 100 
                  ? "bg-violet-600 hover:bg-violet-700" 
                  : "bg-primary hover:bg-primary/90"
                }
              `}
              onClick={() => onView?.(course.id)}
            >
              {course.progress === 100 ? (
                <>Continue Learning <PlayCircle size={16} /></>
              ) : course.progress && course.progress > 0 ? (
                <>Continue ({course.progress}%) </>
              ) : (
                <>Start Learning <PlayCircle size={16} /></>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}