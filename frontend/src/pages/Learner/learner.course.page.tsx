import { useState } from "react";
import { Lock, BookOpen, FileText, Sparkles, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion"; // Highly recommended for "slow move" feel
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

const LearnerCoursePage = () => {
  const { courseId } = useParams();
  const [view, setView] = useState(false);
  const [lessonData, setLessonData] = useState<LearnerLessonResponseType>({
    id: "",
    chapterId: "",
    title: "",
    description: "",
    type: "YouTube",
    fileUrl: "",
    link: "",
    thumbnailUrl: "",
    order: 0,
  });
  if (!courseId) {
    throw new Error("id is missing");
  }

  const { data, isLoading } = useGetLearnerCourse(courseId);
  const [activeTab, setActiveTab] = useState("learning-path");
  const courseData: LearnerCourseData = data?.courseData;
  if (!courseData) {
    return <div>No data....</div>;
  }
  const premium = true;

  const tabs = [
    { id: "learning-path", label: "Learning Path", icon: <BookOpen size={16} /> },
    { id: "instructor", label: "Connect Instructor", isPremium: true },
  ];

  const onSelect = (lesson: LearnerLessonResponseType) => {
    setLessonData(lesson);
    setView(true);
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-50 p-8 transition-colors duration-500">
      <Modal open={view} onClose={() => setView(false)}>
        <UniversalLessonStage lesson={lessonData} />
      </Modal>
      <div className="max-w-5xl mx-auto">
        {/* Header - Kept clean */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{courseData.title}</h1>
            <p className="text-slate-500 font-medium mt-1">{courseData.description}</p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Current Progress
            </span>
            <div className="text-2xl font-black">30%</div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Animated Tab List */}
          <TabsList className="relative flex w-full justify-start bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none h-auto p-0 mb-10 gap-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "relative h-12 bg-transparent px-1 pb-4 pt-2 font-bold text-sm transition-colors duration-300 rounded-none border-b-2 border-transparent",
                  "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
                  "data-[state=active]:text-slate-900 dark:data-[state=active]:text-white",
                )}
              >
                <div className="flex items-center gap-2">
                  {tab.label}
                  {tab.isPremium && !premium && <Lock size={12} className="text-amber-500" />}
                </div>

                {/* The "Slow Move" Underline Animation */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-indigo-600 dark:bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content Area with Fade-in transition */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-[300px]"
          >
            <TabsContent value="learning-path" className="m-0 focus-visible:outline-none">
              {courseData.chapters.map((chapter) => (
                <LearnerChapterItem chapter={chapter} key={chapter.id} onLessonSelect={onSelect} />
              ))}
            </TabsContent>

            {/* ... other TabsContent follow same pattern ... */}

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
                  <p className="text-slate-500 dark:text-slate-400 text-center mt-3 max-w-xs leading-relaxed font-medium">
                    Get unlimited access to instructor support and professional code reviews.
                  </p>
                  <button className="mt-8 flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl font-extrabold hover:opacity-90 transition-all shadow-xl">
                    Upgrade to Premium
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnerCoursePage;
