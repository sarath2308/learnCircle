"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronRight, RefreshCcw, SlidersHorizontal, Star, Calendar, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CourseDiscoveryCard } from "@/components/learner/learner.course.card";

// Hooks
import { useGetCategory } from "@/hooks/shared/category.get";
import { useGetSubCategories } from "@/hooks/shared/sub.category.get";
import { useGetAllCourseForLearner } from "@/hooks/learner/course/learner.get.all.course.hook";

// Custom Debounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const LearnerAllCoursePage = () => {
  // 1. Unified Filter & Sort State
  const [filters, setFilters] = useState({
    search: "",
    categoryId: '',
    subCategoryId: '',
    type: "",
    sortDate: 1,    // 1: Newest, -1: Oldest, 0: Inactive
    sortRating: 0,  // 1: Highest, -1: Lowest, 0: Inactive
    sortPrice: 0,   // 1: Low-High, -1: High-Low, 0: Inactive
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  // Data Fetching
  const { data: courseResponse, isLoading: coursesLoading } = useGetAllCourseForLearner(filters);
  const categoryQuery = useGetCategory();
  const categoryData = categoryQuery.data ?? [];
  const { data: subData } = useGetSubCategories(filters.categoryId);
  const subCategories = subData?.subCategories ?? [];

  const allCourses = courseResponse?.courseData ?? [];


  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ 
      ...prev, 
      [key]: value,
      // If setting a sort, disable other sorts to prevent logic conflicts
      ...(key === 'sortRating' ? { sortPrice: 0, sortDate: 0 } : {}),
      ...(key === 'sortPrice' ? { sortRating: 0, sortDate: 0 } : {}),
      ...(key === 'sortDate' ? { sortRating: 0, sortPrice: 0 } : {}),
      // Reset subcategory if category changes
      ...(key === 'categoryId' ? { subCategory: null } : {})
    }));
  };

  const resetAll = () => {
    setFilters({
      search: "",
      categoryId: "",
      subCategoryId: "",
      type: "",
      sortDate: 1,
      sortRating: 0,
      sortPrice: 0,
    });
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg dark:text-slate-100">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetAll} className="text-indigo-600 dark:text-indigo-400 h-8">
          <RefreshCcw className="w-3 h-3 mr-2" /> Reset
        </Button>
      </div>

      {/* Pricing Section */}
      <div>
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Pricing</h4>
        <RadioGroup value={filters.type} onValueChange={(val) => updateFilter('type', val)} className="space-y-2">
          {["All", "Free", "Paid"].map((t) => (
            <div key={t} className="flex items-center space-x-2">
              <RadioGroupItem value={t} id={`price-${t}`} />
              <label htmlFor={`price-${t}`} className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize cursor-pointer">{t}</label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator className="dark:bg-slate-800" />

      {/* Categories Section */}
      <div>
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Categories</h4>
        <div className="space-y-1">
          {categoryData.map((cat: any) => (
            <div key={cat.id}>
              <button
                onClick={() => updateFilter('categoryId', filters.categoryId === cat.id ? null : cat.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm font-medium transition-all ${
                  filters.categoryId === cat.id 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {cat.name}
                <ChevronRight className={`w-4 h-4 transition-transform ${filters.categoryId === cat.id ? "rotate-90" : ""}`} />
              </button>
              
              {filters.categoryId === cat.id && (
                <div className="mt-2 ml-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1">
                  <RadioGroup 
                    value={filters.subCategoryId ?? ""} 
                    onValueChange={(val) => updateFilter('subCategoryId', val)}
                    className="space-y-3 py-2"
                  >
                    {subCategories.map((sub: any) => (
                      <div key={sub.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={sub.id} id={sub.id} />
                        <label htmlFor={sub.id} className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                          {sub.name}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        
        {/* Header & Search */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Browse Courses</h1>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search skills..." 
                  className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex items-center gap-2 dark:bg-slate-900 dark:border-slate-800">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-white dark:bg-slate-950 p-6 overflow-y-auto border-r dark:border-slate-800">
                  <SheetHeader className="text-left mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Sorting Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-2">Sort:</span>
              
              <Button 
                variant={filters.sortDate !== 0 ? "default" : "outline"} 
                size="sm" 
                className="h-8 text-xs gap-2 rounded-full"
                onClick={() => updateFilter('sortDate', filters.sortDate === 1 ? -1 : 1)}
              >
                <Calendar className="w-3 h-3" />
                Date {filters.sortDate === 1 ? "↓" : "↑"}
              </Button>

              <Button 
                variant={filters.sortRating !== 0 ? "default" : "outline"} 
                size="sm" 
                className="h-8 text-xs gap-2 rounded-full"
                onClick={() => updateFilter('sortRating', filters.sortRating === 1 ? -1 : 1)}
              >
                <Star className="w-3 h-3" />
                Rating {filters.sortRating === 1 ? "↓" : "↑"}
              </Button>

              <Button 
                variant={filters.sortPrice !== 0 ? "default" : "outline"} 
                size="sm" 
                className="h-8 text-xs gap-2 rounded-full"
                onClick={() => updateFilter('sortPrice', filters.sortPrice === 1 ? -1 : 1)}
              >
                <Tag className="w-3 h-3" />
                Price {filters.sortPrice === 1 ? "↓" : "↑"}
              </Button>
            </div>

            <p className="text-sm font-medium text-slate-500">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{allCourses.length}</span> Results
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-6 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          <main className="flex-1">
            {coursesLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  ))}
               </div>
            ) : allCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {allCourses.map((course: any) => (
                  <CourseDiscoveryCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 font-medium">No courses found matching your criteria.</p>
                <Button onClick={resetAll} variant="link" className="text-indigo-600 mt-2">Clear all filters</Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LearnerAllCoursePage;