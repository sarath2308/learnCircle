"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGetHome } from "@/hooks/learner/home/useGetHome";

// Fix your interface imports or keep them here
export interface CourseCardType {
  id: string;
  title: string;
  category: { name: string };
  thumbnailUrl: string;
  price?: number;
  createdBy: { name: string };
  averageRating?: number;
  skillLevel: string;
  // ... other fields
}

type CategoryType = {
  id: string;
  name: string;
};

const HomePage = () => {
  const { data, isLoading } = useGetHome();

  // FIX: Type correctly and provide empty array fallbacks
  const courseData: CourseCardType[] = data?.courseCardData || [];
  const categoryData: CategoryType[] = data?.categoryData || [];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-black text-2xl animate-pulse">
        LOADING EXPERIENCE...
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden bg-slate-900 flex items-center px-6 md:px-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover opacity-30"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-blue-600 text-white border-none px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
            New Platform Launch 🚀
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            The Future of <span className="text-blue-500 italic">Learning</span> is Here.
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
            Stop watching, start building. Access top-rated courses taught by industry veterans.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all font-black text-base">
              Explore Courses <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button variant="ghost" size="lg" className="h-14 px-6 text-white hover:bg-white/10 font-bold">
              <Play size={18} className="mr-2" fill="currentColor" /> Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* --- QUICK CATEGORIES --- */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Popular Categories</h2>
          <Button variant="link" className="text-blue-600 font-black p-0 uppercase tracking-widest text-xs">View all</Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categoryData.map((cat) => (
            <button 
              key={cat.id}
              className="px-8 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-sm font-black whitespace-nowrap hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* --- TRENDING COURSES --- */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Trending Now</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">The most popular courses this week</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courseData.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Card className="border-none bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem] shadow-md hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-500/20">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.thumbnailUrl} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={course.title}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/60 backdrop-blur-md text-white border-none font-bold text-[10px]">
                      {course.category.name}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500 font-black text-sm">
                      <Star size={16} fill="currentColor" /> {course.averageRating || "N/A"}
                    </div>
                    <Badge variant="outline" className="rounded-full border-slate-200 text-slate-400 font-bold text-[10px]">
                      {course.skillLevel || "All Levels"}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-black leading-tight min-h-[56px] line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                      {course.createdBy.name.charAt(0)}
                    </div>
                    <p className="text-slate-500 text-sm font-bold tracking-tight">
                      By <span className="text-slate-900 dark:text-white">{course.createdBy.name}</span>
                    </p>
                  </div>
                  
                  <div className="pt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {course.price ? `$${course.price}` : "FREE"}
                    </span>
                    <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PROGRESS SECTION --- */}
      <section className="bg-slate-950 rounded-[3.5rem] py-20 px-6 md:px-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-black tracking-tighter mb-10 italic">Jump back in</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example of what a real "Recently Viewed" might look like */}
            <div className="flex gap-5 items-center bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="h-16 w-16 rounded-2xl bg-blue-600 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <Play fill="white" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black truncate group-hover:text-blue-400 transition-colors">Resume: React Advanced Patterns</h4>
                <div className="h-1 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]" />
                </div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-2">65% COMPLETED</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;