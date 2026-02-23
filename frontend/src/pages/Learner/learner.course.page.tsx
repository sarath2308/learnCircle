"use client";

import { useState } from "react";
import {
  Lock,
  BookOpen,
  Star,
  Users,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Clock,
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
import { Badge } from "@mui/material";
import { useCourseReviewCreate } from "@/hooks/shared/course-review/course.review.create";
import { useGetCourseReviewForView } from "@/hooks/shared/course-review/course.review.get.hook";
import type { IReviewType } from "@/types/shared/review.type";
import ReviewModal from "@/components/learner/learner.review.modal";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ReviewItem } from "@/components/shared/review.card";
import { useCourseReviewUpdate } from "@/hooks/shared/course-review/course.review.update.hook";
import { useDeleteCourseReview } from "@/hooks/shared/course-review/course.review.delete.hook";

// --- MAIN PAGE COMPONENT ---
const LearnerCoursePage = () => {
  const { courseId } = useParams();
  const [view, setView] = useState(false);
  const [activeTab, setActiveTab] = useState("learning-path");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  const courseReviewMutation = useCourseReviewCreate();
  const courseUpdateMutation = useCourseReviewUpdate();
  const courseDeleteMutation = useDeleteCourseReview();
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

  if (!courseId) throw new Error("Course ID is missing");

  const { data, isLoading } = useGetLearnerCourse(courseId);
  const courseData: LearnerCourseData = data?.courseData;
  const { data: courseReview, refetch: reviewRefetch } = useGetCourseReviewForView(courseId);

  const reviews: IReviewType[] = courseReview?.reviews ?? [];
  const averageRating = courseReview?.averageRating ?? 0;

  // Placeholder Stats
  const stats = {
    enrolled: 1240,
    lastUpdated: "Feb 2026",
    language: "English",
  };

  if (isLoading)
    return (
      <div className="p-20 text-center font-black animate-pulse">LOADING ELITE CONTENT...</div>
    );
  if (!courseData) return <div className="p-20 text-center font-black">COURSE NOT FOUND</div>;

  const premium = true;

  const handleReviewSubmit = async (rating: number, comment?: string) => {
    await courseReviewMutation.mutateAsync({
      courseId,
      payload: { rating, comment: comment ?? "" },
    });
    setIsReviewModalOpen(false);
    reviewRefetch();
  };

  const handleUpdateReview = async (
    id: string,
    updatedData: { rating: number; comment: string },
  ) => {
    await courseUpdateMutation.mutateAsync({
      reviewId: id,
      payload: { rating: updatedData.rating, comment: updatedData.comment ?? "" },
    });
    reviewRefetch();
  };

  const handleDeleteReview = async (id: string) => {
    await courseDeleteMutation.mutateAsync(id);
    reviewRefetch();
  };

  const onSelect = (lesson: LearnerLessonResponseType) => {
    setLessonData(lesson);
    setView(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b0f] text-slate-900 dark:text-slate-50 p-6 md:p-12 transition-colors duration-500">
      <Modal open={view} onClose={() => setView(false)}>
        <UniversalLessonStage lesson={lessonData} />
      </Modal>

      <ReviewModal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />

      <div className="max-w-6xl mx-auto">
        {/* TOP ACTION BAR */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:opacity-70 transition-all"
            >
              <Star size={14} /> Leave a Review
            </button>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:opacity-70 transition-all">
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
              <Badge className="bg-indigo-600 text-white rounded-md text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                Bestseller
              </Badge>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={12} /> Updated {stats.lastUpdated}
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">
              {courseData.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-2xl leading-relaxed">
              {courseData.description}
            </p>

            <div className="flex flex-wrap gap-8 mt-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Average Rating
                </span>
                <div className="flex items-center gap-1.5 text-xl font-black">
                  {averageRating} <Star size={16} className="fill-amber-500 text-amber-500" />
                  <span className="text-sm font-bold text-slate-400 underline decoration-slate-200">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
              <div className="flex flex-col border-l border-slate-200 dark:border-slate-800 pl-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Learners Enrolled
                </span>
                <div className="flex items-center gap-1.5 text-xl font-black">
                  <Users size={18} className="text-indigo-600" /> {stats.enrolled.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative flex w-full justify-start bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none h-auto p-0 mb-10 gap-8">
            {[
              { id: "learning-path", label: "Curriculum", icon: <BookOpen size={16} /> },
              {
                id: "reviews",
                label: `Feedback (${reviews.length})`,
                icon: <MessageSquare size={16} />,
              },
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
                  {tab.label}{" "}
                  {tab.isPremium && !premium && <Lock size={12} className="text-amber-500" />}
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-indigo-600 dark:bg-white"
                  />
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
                    <LearnerChapterItem
                      chapter={chapter}
                      key={chapter.id}
                      onLessonSelect={onSelect}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="m-0 focus-visible:outline-none">
                <div className="grid gap-6 max-w-4xl">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <ReviewItem
                        key={rev.id}
                        review={rev}
                        variant={rev.userId === currentUser?.id ? "author" : "viewer"}
                        onUpdate={handleUpdateReview}
                        onDelete={handleDeleteReview}
                      />
                    ))
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                        No feedback yet. Share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="m-0 focus-visible:outline-none">
                {premium ? (
                  <InstructorConnectComponent courseId={courseId} />
                ) : (
                  <p>Upgrade to Premium</p>
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
