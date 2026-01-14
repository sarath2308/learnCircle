"use client";

import { useState } from "react";
import { Plus, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import { useGetCreatorCourses } from "@/hooks/shared/course-creator/creator.courses.get";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";

const TABS = [
  { label: "All Courses", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
] as const;

type TabValue = typeof TABS[number]["value"];

interface MyCourseProps {
  onEdit: (id: string) => void;
  onPublish: (id: string) => void;
  onView: (id: string) => void;
  onCreate:() => void;
}


export default function MyCourse({onEdit,onPublish,onView,onCreate}:MyCourseProps) {
  const [tab, setTab] = useState<TabValue>("all");

  const { data, isLoading } = useGetCreatorCourses(
    tab === "all" ? undefined : tab
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-50/30 dark:bg-transparent">
      
      {/* 1. Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage your curriculum and track student enrollment.
          </p>
        </div>
         <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-6 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none flex gap-2" onClick={()=>onCreate()}>
          <Plus size={20} strokeWidth={3} />
          Create New Course
        </Button>
      </header>

      {/* 2. Custom Tailwind Tabs & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                tab === t.value 
                  ? "text-blue-600" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              {t.label}
              {tab === t.value && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200 dark:border-slate-800">
            <SlidersHorizontal size={16} />
          </Button>
        </div>
      </div>

      {/* 3. Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !data?.courseData || data.courseData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
            <LayoutGrid size={48} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No courses found</h3>
          <p className="text-slate-500 max-w-xs text-center mt-2 text-sm">
            {tab === "all" 
              ? "You haven't created any courses yet. Start your journey today!" 
              : `You don't have any courses in ${tab} status.`}
          </p>
          <Button 
            variant="link" 
            onClick={() => setTab("all")}
            className="mt-4 text-blue-600 font-bold"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {data.courseData.map((course: any) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={onEdit}
              onPublish={onPublish}
              onView={onView}
              variant="creator"
            />
          ))}
        </div>
      )}
    </div>
  );
}