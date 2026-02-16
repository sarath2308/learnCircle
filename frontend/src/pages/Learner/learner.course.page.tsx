"use client";

import { useState, useMemo } from "react";
import { 
  Lock, BookOpen, ChevronRight, Star, Users, 
  MessageSquare, AlertTriangle, ShieldCheck, 
  Clock, Globe 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  useGetLearnerCourse,
  type LearnerCourseData,
  type LearnerLessonResponseType,
} from "@/hooks/learner/course/learner.course.get.hook";
import { useParams } from "react-router-dom";
import LearnerChapterItem from "@/components/learner/learner.chapter.component";
import { Modal } from "@/components/Modal";
import UniversalLessonStage from "@/components/learner/learner.lesson.stage";
import InstructorConnectComponent from "@/components/shared/instructor.connect.componet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@mui/material";

const LearnerCoursePage = () => {
  const { courseId } = useParams();
  const [view, setView] = useState(false);
  const [activeTab, setActiveTab] = useState("learning-path");
  
  // Review & Feedback State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [lessonData, setLessonData] = useState<LearnerLessonResponseType>({
    id: "", chapterId: "", title: "", description: "", type: "YouTube",
    fileUrl: "", link: "", thumbnailUrl: "", order: 0,
  });

  if (!courseId) throw new Error("Course ID is missing");

  const { data, isLoading } = useGetLearnerCourse(courseId);
  const courseData: LearnerCourseData = data?.courseData;

  // Placeholder Stats (To be replaced by courseData later)
  const stats = {
    enrolled: 1240,
    avgRating: 4.8,
    totalReviews: 85,
    lastUpdated: "Feb 2026",
    language: "English"
  };

  if (isLoading) return <div className="p-20 text-center font-black animate-pulse">LOADING ELITE CONTENT...</div>;
  if (!courseData) return <div className="p-20 text-center font-black">COURSE NOT FOUND</div>;

  const premium = true;

  const handleReviewSubmit = () => {
    const feedback = { courseId, rating, comment, timestamp: new Date().toISOString() };
    console.log("%c[COURSE_REVIEW_SUBMITTED]", "color: #6366f1; font-weight: bold; font-size: 12px;", feedback);
    
    // Reset and Close
    setIsReviewModalOpen(false);
    setRating(0);
    setComment("");
  };

  const handleReportCourse = () => {
    console.warn(`[REPORT_COURSE] Action triggered for Course ID: ${courseId}`);
    alert("Report feature flagged. Our admins will review this course manually.");
  };

  const onSelect = (lesson: LearnerLessonResponseType) => {
    setLessonData(lesson);
    setView(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b0f] text-slate-900 dark:text-slate-50 p-6 md:p-12 transition-colors duration-500">
      
      {/* LESSON MODAL */}
      <Modal open={view} onClose={() => setView(false)}>
        <UniversalLessonStage lesson={lessonData} />
      </Modal>

      {/* REVIEW MODAL */}
      <Modal open={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>

          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Rate this Course</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Your feedback drives quality.</p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <button 
                key={s} 
                onMouseEnter={() => setHoverRating(s)} 
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="transition-transform active:scale-125"
              >
                <Star size={32} className={cn("transition-colors", (hoverRating || rating) >= s ? "fill-indigo-600 text-indigo-600" : "text-slate-200 fill-slate-50")} />
              </button>
            ))}
          </div>

          <Textarea 
            placeholder="What did you think of the curriculum? (Optional)"
            className="rounded-2xl border-slate-100 dark:border-slate-800 mb-6 min-h-[120px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button 
            disabled={rating === 0}
            onClick={handleReviewSubmit}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl"
          >
            Submit Review
          </Button>
      </Modal>

      <div className="max-w-6xl mx-auto">
        {/* TOP ACTION BAR */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex gap-4">
                <button onClick={() => setIsReviewModalOpen(true)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:opacity-70 transition-all">
                    <Star size={14} /> Leave a Review
                </button>
                <button onClick={handleReportCourse} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:opacity-70 transition-all">
                    <AlertTriangle size={14} /> Report
                </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure Certification
            </div>
        </div>

        {/* HEADER SECTION */}
        <header className="grid md:grid-cols-[1fr_auto] gap-8 items-start mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-indigo-600 text-white rounded-md text-[9px] font-black uppercase tracking-widest">Bestseller</Badge>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12}/> Updated {stats.lastUpdated}
                </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">{courseData.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-2xl leading-relaxed">{courseData.description}</p>
            
            {/* STATS BAR */}
            <div className="flex flex-wrap gap-8 mt-8">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Average Rating</span>
                    <div className="flex items-center gap-1.5 text-xl font-black">
                        {stats.avgRating} <Star size={16} className="fill-amber-500 text-amber-500" />
                        <span className="text-sm font-bold text-slate-400 underline decoration-slate-200">({stats.totalReviews} reviews)</span>
                    </div>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-slate-800 pl-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Learners Enrolled</span>
                    <div className="flex items-center gap-1.5 text-xl font-black">
                        <Users size={18} className="text-indigo-600" /> {stats.enrolled.toLocaleString()}
                    </div>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-slate-800 pl-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Language</span>
                    <div className="flex items-center gap-1.5 text-xl font-black uppercase tracking-tighter">
                        <Globe size={18} className="text-slate-400" /> {stats.language}
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-center w-full md:w-48">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Your Progress</span>
             <div className="relative h-24 w-24 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-slate-200 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-indigo-600" strokeWidth="3" strokeDasharray="30, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-black">30%</div>
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase">12/34 Lessons Done</p>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative flex w-full justify-start bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none h-auto p-0 mb-10 gap-8">
            {[
              { id: "learning-path", label: "Curriculum", icon: <BookOpen size={16} /> },
              { id: "instructor", label: "Live Support", isPremium: true },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "relative h-12 bg-transparent px-1 pb-4 pt-2 font-black text-xs uppercase tracking-widest transition-all rounded-none",
                  "text-slate-400 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white",
                )}
              >
                <div className="flex items-center gap-2">
                  {tab.label}
                  {tab.isPremium && !premium && <Lock size={12} className="text-amber-500" />}
                </div>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-600 dark:bg-white" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
            >
                <TabsContent value="learning-path" className="m-0 focus-visible:outline-none">
                <div className="space-y-4">
                    {courseData.chapters.map((chapter) => (
                        <LearnerChapterItem chapter={chapter} key={chapter.id} onLessonSelect={onSelect} />
                    ))}
                </div>
                </TabsContent>

                <TabsContent value="instructor" className="m-0 focus-visible:outline-none">
                {premium ? (
                    <InstructorConnectComponent courseId={courseId} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] to-transparent" />
                    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <Lock size={32} className="text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Members Only</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center mt-3 max-w-xs leading-relaxed font-bold uppercase tracking-tighter text-xs">
                        Unlock 1-on-1 mentor support and exclusive code reviews.
                    </p>
                    <button className="mt-8 flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">
                        Upgrade to Premium
                        <ChevronRight size={18} />
                    </button>
                    </div>
                )}
                </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnerCoursePage;