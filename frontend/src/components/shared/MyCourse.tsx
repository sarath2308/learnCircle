"use client";

import { useState, useMemo } from "react";
import { Plus, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import { useGetCreatorCourses } from "@/hooks/shared/course-creator/creator.courses.get";
import CourseCard from "./CourseCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategory } from "@/hooks/shared/category.get";
import { Label } from "@/components/ui/label";

const TABS = [
  { label: "All Courses", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

interface MyCourseProps {
  onPublish: (id: string) => void;
  onView: (id: string) => void;
  onCreate: () => void;
}

export default function MyCourse({ onPublish, onView, onCreate }: MyCourseProps) {
  const [tab, setTab] = useState<TabValue>("all");

  // 1. Integrated Filter State (including Search)
  const [filters, setFilters] = useState({
    priceType: "all",
    category: "all",
    skillLevel: "all",
    search: "",
  });

  // 2. Logic to prevent sending "all" to the API
  // We transform "all" to undefined so the API ignores the filter
  const apiParams = useMemo(() => {
    return {
      status: tab === "all" ? undefined : tab,
      search: filters.search || undefined,
      category: filters.category === "all" ? undefined : filters.category,
      priceType: filters.priceType === "all" ? undefined : filters.priceType,
      skillLevel: filters.skillLevel === "all" ? undefined : filters.skillLevel,
    };
  }, [tab, filters]);

  const { data, isLoading } = useGetCreatorCourses(apiParams);
  const { data: categoryData, isLoading: categoriesLoading } = useGetCategory();

  const activeFilterCount = Object.values(filters).filter((v) => v !== "all" && v !== "").length;

  const resetFilters = () => {
    setFilters({ priceType: "all", category: "all", skillLevel: "all", search: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-slate-50/30 dark:bg-transparent">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            My Courses
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium tracking-tight">
            Manage your curriculum and track student enrollment.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-6 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none flex gap-2"
          onClick={onCreate}
        >
          <Plus size={20} strokeWidth={3} />
          Create New Course
        </Button>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                tab === t.value ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t.label}
              {tab === t.value && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 pb-4 w-full md:w-auto">
          {/* Search Input tied to Filter State */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl relative border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <SlidersHorizontal size={16} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ring-2 ring-white dark:ring-slate-950">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 p-4 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B26] z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <DropdownMenuLabel className="p-0 text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Filters
                </DropdownMenuLabel>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <DropdownMenuSeparator className="mb-4 bg-slate-100 dark:bg-slate-800" />

              <div className="space-y-4">
                <FilterField
                  label="Pricing"
                  value={filters.priceType}
                  onValueChange={(v: string) => setFilters({ ...filters, priceType: v })}
                  options={["Free", "Paid"]}
                />
                <FilterField
                  label="Level"
                  value={filters.skillLevel}
                  onValueChange={(v: string) => setFilters({ ...filters, skillLevel: v })}
                  options={["Beginner", "Intermediate", "Advanced"]}
                />

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">
                    Category
                  </Label>
                  <Select
                    value={filters.category}
                    onValueChange={(v) => setFilters({ ...filters, category: v })}
                  >
                    <SelectTrigger className="h-9 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-gray-800 rounded-lg text-xs">
                      <SelectValue
                        placeholder={categoriesLoading ? "Loading..." : "All Categories"}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-950 border-slate-200 dark:border-gray-800 shadow-2xl">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryData?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-xs">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 3. Grid Display (No client-side .filter() needed since the Hook handles it) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : !data?.courseData || data.courseData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
          <LayoutGrid size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No courses found</h3>
          <Button variant="link" onClick={resetFilters} className="mt-2 text-blue-600 font-bold">
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {data.courseData.map((course: any) => (
            <CourseCard
              key={course.id}
              course={course}
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

function FilterField({ label, value, onValueChange, options }: any) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-tight">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-9 rounded-lg text-xs border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-[#1C2331] border-slate-200 dark:border-slate-800">
          <SelectItem value="all" className="text-xs">
            All {label}s
          </SelectItem>
          {options.map((opt: string) => (
            <SelectItem key={opt} value={opt} className="text-xs">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
