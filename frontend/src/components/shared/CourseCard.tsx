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
  type?: "Free" | "Paid";
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
   <div className="group cursor-pointer">
  {/* Thumbnail */}
  <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
  {course?.type === "Free" ?( <Badge className="absolute top-2 right-2 font-mono bg-blue-600 text-white">Free</Badge>):( <Badge className="absolute top-2 right-2 font-mono bg-yellow-500 text-white">Paid</Badge>)}
  {course.status === "draft" && <Badge className="absolute top-2 right-17 bg-green-400">Draft</Badge>}
    <img
      src={course.thumbnail || "/course-placeholder.webp"}
      alt={course.title}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
    
  </div>

  {/* Text */}
  <div className="mt-3 space-y-1">
    <div className="flex items-center justify-between">
  <h3 className="text-sm font-medium leading-snug text-slate-900 line-clamp-2">
      {course.title}
    </h3>
    {course.status === "draft" && <Button className="bg-green-500 rounded-2xl p-3 hover:bg-blue-400 dark:text-white font-semibold">Publish</Button>}
    </div>
  

    <p className="text-xs text-slate-500">
      {course.status === "draft"
        ? "Draft"
        : `Published on `}
    </p>
  </div>
</div>

  );
}