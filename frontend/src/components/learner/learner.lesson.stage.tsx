"use client";

import { FileText, Youtube, ExternalLink, PlayCircle, BookOpen, AlertCircle } from "lucide-react";
import type { LearnerLessonResponseType } from "@/hooks/learner/course/learner.course.get.hook";
import { motion } from "framer-motion";

interface StageProps {
  lesson: LearnerLessonResponseType | null;
}

const UniversalLessonStage = ({ lesson }: StageProps) => {
  // 1. Empty State: What the user sees before picking a lesson
  if (!lesson) {
    return (
      <div className="w-full aspect-video rounded-[2.5rem] bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center mb-6">
          <PlayCircle className="text-indigo-500 animate-pulse" size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          Ready to start?
        </h3>
        <p className="text-slate-500 text-sm max-w-xs mt-2 font-medium">
          Select a lesson from the curriculum to begin your learning session.
        </p>
      </div>
    );
  }

  // 2. Content Renderer Logic
  const renderContent = () => {
    switch (lesson.type) {
      case "Video":
        return (
          <video
            key={lesson.fileUrl} // Vital: forces re-load on lesson change
            controls
            controlsList="nodownload"
            poster={lesson.thumbnailUrl}
            className="w-full h-full object-contain bg-black"
          >
            <source src={lesson.fileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "YouTube":
        const videoId = lesson.link?.includes("v=")
          ? lesson.link.split("v=")[1].split("&")[0]
          : lesson.link?.split("/").pop();
        return (
          <iframe
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );

      case "PDF":
        return (
          <div className="w-full h-full bg-slate-800 relative group">
            <iframe
              key={lesson.fileUrl}
              src={`${lesson.fileUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none"
            />
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={lesson.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-2xl hover:bg-indigo-700 transition-all"
              >
                Open Full PDF <ExternalLink size={14} />
              </a>
            </div>
          </div>
        );

      case "Article":
      case "Blog":
        return (
          <div className="w-full h-full overflow-y-auto bg-white dark:bg-slate-950 p-8 md:p-16 scrollbar-hide">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <img src={lesson.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight">{lesson.title}</h1>
                <div className="h-1 w-20 bg-indigo-600 rounded-full" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium">
                {lesson.description}
              </p>
              <a
                href={lesson.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black hover:opacity-90 transition-all shadow-xl"
              >
                Read Full Article <ExternalLink size={18} />
              </a>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400 gap-2">
            <AlertCircle size={20} />
            <p className="font-bold uppercase tracking-widest text-xs">Unknown Content Type</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* THE STAGE BOX */}
      <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-500">
        <div className="absolute inset-0 flex items-center justify-center">{renderContent()}</div>
      </div>

      {/* LESSON DETAILS PANEL */}
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4"
      >
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full">
            {lesson.type === "Video" || lesson.type === "YouTube" ? (
              <PlayCircle size={14} />
            ) : (
              <FileText size={14} />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest">{lesson.type}</span>
          </div>
          <span className="text-slate-200 dark:text-slate-800">|</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
            Order: #{lesson.order}
          </span>
        </div>

        <h2 className="text-3xl font-black tracking-tight mb-4">{lesson.title}</h2>
        <div className="max-w-3xl">
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {lesson.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default UniversalLessonStage;
