"use client";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetHome } from "@/hooks/learner/home/useGetHome";
import { CourseDiscoveryCard } from "@/components/learner/learner.course.card";
import Chatbot from "@/components/shared/chatbot.component";

export interface ILearnerHomeCourseType {
  id: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  subCategory: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  thumbnailUrl: string;
  price?: number;
  discount?: number;
  type: "Free" | "Paid";
  chapterCount?: number;
  totalDuration?: number;
  averageRating?: number;
}

const HomePage = () => {
  const { data, isLoading } = useGetHome();
  if (isLoading) {
    return <div> Loading...</div>;
  }
  const courseData: ILearnerHomeCourseType[] | [] = data.courseCardData ?? [];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950 font-black text-2xl text-blue-600 animate-pulse">
        LOADING EXPERIENCE...
      </div>
    );
  }

  return (
    /* Main container: Light by default, Slate-950 in Dark Mode */
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <div className="space-y-20 pb-20 max-w-[1400px] mx-auto pt-10">
        {/* --- HERO SECTION --- */}
        <section className="relative h-[500px] md:h-[600px] mx-4 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center px-6 md:px-16">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover opacity-20 dark:opacity-40"
              alt="Hero Background"
            />
            {/* Dynamic Gradient based on theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/60" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-6">
            <Badge className="bg-blue-600 text-white border-none px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              New Platform Launch 🚀
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
              The Future of <span className="text-blue-600 italic">Learning.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Stop watching, start building. Access top-rated courses taught by industry veterans.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-blue-600 transition-all font-black"
              >
                Explore Courses <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-6 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl"
              >
                <Play size={18} className="mr-2" /> Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* --- TRENDING COURSES --- */}
        <section className="px-6 md:px-10">
          <div className="mb-10">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
              Trending Now
            </h2>
            <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {!courseData.length && <div>No course found..</div>}
            {courseData.map((course) => (
              <CourseDiscoveryCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* --- PROGRESS SECTION --- */}
        <section className="mx-4 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] py-16 px-6 md:px-16 border border-slate-100 dark:border-slate-800/50 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tighter mb-8 italic dark:text-white text-slate-900">
              Jump back in
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-5 items-center bg-white dark:bg-slate-950/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:shadow-lg transition-all cursor-pointer group">
                <div className="h-14 w-14 rounded-2xl bg-blue-600 flex-shrink-0 flex items-center justify-center">
                  <Play fill="white" size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black truncate text-slate-900 dark:text-white group-hover:text-blue-600">
                    React Advanced Patterns
                  </h4>
                  <div className="h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-blue-600 w-[65%]" />
                  </div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mt-2">
                    65% COMPLETED
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Chatbot />
    </div>
  );
};

export default HomePage;
