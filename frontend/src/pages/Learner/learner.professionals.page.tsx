import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, UserX, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ProfessionalProfileCard from '@/components/learner/learner.profile.card';
import { useGetProfessionalsProfile } from '@/hooks/learner/professionals/learner.professionals.get.hook';

export interface IProfileData {
  instructorId: string;
  name: string;
  profileUrl: string;
  rating: number;
  title: string;
}

const ProfessionalDirectory = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic: Don't spam the API on every keypress
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: ProfileResponse, isLoading } = useGetProfessionalsProfile(debouncedSearch, page);

  // Safe data extraction with fallbacks
  const profileData: IProfileData[] = ProfileResponse?.profileData || [];
  const totalPages = ProfileResponse?.totalPages || 1;

  return (
    <main className="min-h-screen p-4 md:p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN CONTENT */}
        <section className="lg:col-span-9 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Meet Professionals</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Connect with experienced professionals.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by name, skill, or domain..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg"
            />
            {isLoading && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-blue-500" />}
          </div>

          {/* RENDERING LOGIC */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : profileData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {profileData.map((pro) => (
                <ProfessionalProfileCard key={pro.instructorId} {...pro} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <UserX className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No professionals found</h3>
              <p className="text-slate-500">Try adjusting your search keywords.</p>
            </div>
          )}

          {/* Pagination - Only show if data exists */}
          {profileData.length > 0 && (
            <div className="flex items-center justify-center gap-1 pt-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium px-4 dark:text-slate-400">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* SIDEBAR */}
        <aside className="lg:col-span-3 space-y-6">
          <SidebarBox title="Active Requests" />
          <SidebarBox title="Top-Rated" />
        </aside>
      </div>
    </main>
  );
};

// Sub-components for cleaner code
const SkeletonCard = () => (
  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
    <Skeleton className="h-14 w-14 rounded-full mx-auto" />
    <Skeleton className="h-4 w-3/4 mx-auto" />
    <Skeleton className="h-3 w-1/2 mx-auto" />
    <Skeleton className="h-6 w-12 rounded-full mx-auto" />
  </div>
);

const SidebarBox = ({ title }: { title: string }) => (
  <div className="p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
    <h2 className="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-tighter opacity-70">{title}</h2>
    <div className="py-8 text-center text-[10px] text-slate-400 italic font-medium uppercase">Empty Space</div>
  </div>
);

export default ProfessionalDirectory;