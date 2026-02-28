/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, BookOpen, Star, Users, MessageSquare, ShieldCheck, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "@mui/material";
import toast from "react-hot-toast";

// Hooks & Types
import {
  useGetLearnerCourse,
  type LearnerCourseData,
  type LearnerLessonResponseType,
} from "@/hooks/learner/course/learner.course.get.hook";
import { useCourseReviewCreate } from "@/hooks/shared/course-review/course.review.create";
import { useGetCourseReviewForView } from "@/hooks/shared/course-review/course.review.get.hook";
import { useCourseReviewUpdate } from "@/hooks/shared/course-review/course.review.update.hook";
import { useDeleteCourseReview } from "@/hooks/shared/course-review/course.review.delete.hook";
import { useEnrollUser } from "@/hooks/shared/enroll/enroll.hook";
import { useGetPaymentStatus } from "@/hooks/shared/payment/payment.get.status";
import { loadRazorpay } from "@/helper/razorpay";

import LearnerChapterItem from "@/components/learner/learner.chapter.component";
import { Modal } from "@/components/Modal";
import UniversalLessonStage from "@/components/learner/learner.lesson.stage";
import InstructorConnectComponent from "@/components/shared/instructor.connect.componet";
import ReviewModal from "@/components/learner/learner.review.modal";
import { ReviewItem } from "@/components/shared/review.card";
import { PaymentStatus, PaymentStatusOverlay } from "@/components/shared/payment.overlay.component";

import { ENROLLMENT_STATUS } from "@/types/learner/enrollment.status.type";
import type { IReviewType } from "@/types/shared/review.type";
import type { RootState } from "@/redux/store";

const LearnerCoursePage = () => {
  const { courseId } = useParams();
  const [view, setView] = useState(false);
  const [activeTab, setActiveTab] = useState("learning-path");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Payment States
  const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.IDLE);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const pollAttemptsRef = useRef(0);
  const isPollingRef = useRef(false);

  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  const courseReviewMutation = useCourseReviewCreate();
  const courseUpdateMutation = useCourseReviewUpdate();
  const courseDeleteMutation = useDeleteCourseReview();
  const enrollUserMutation = useEnrollUser();
  const checkPaymentStatusMutation = useGetPaymentStatus();

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

  const { data, isLoading, refetch } = useGetLearnerCourse(courseId);
  const courseData: LearnerCourseData = data?.courseData;
  const { data: courseReview, refetch: reviewRefetch } = useGetCourseReviewForView(courseId);

  const reviews: IReviewType[] = courseReview?.reviews ?? [];
  const averageRating = courseReview?.averageRating ?? 0;

  // --- PAYMENT POLLING LOGIC ---
  useEffect(() => {
    if (!pendingOrderId || isPollingRef.current) return;
    isPollingRef.current = true;
    let pollTimer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await checkPaymentStatusMutation.mutateAsync(pendingOrderId!);
        if (res.paymentStatus === "PAID") {
          setPaymentStatus(PaymentStatus.SUCCESS);
          setPendingOrderId(null);
          isPollingRef.current = false;
          refetch();
          return;
        }
        if (["FAILED", "CANCELLED"].includes(res.paymentStatus)) {
          setPaymentStatus(PaymentStatus.FAILED);
          setPendingOrderId(null);
          isPollingRef.current = false;
          return;
        }
        if (pollAttemptsRef.current < 10) {
          pollAttemptsRef.current++;
          pollTimer = setTimeout(poll, 3000);
        } else {
          toast.error("Verification timeout. Refresh the page.");
          setPaymentStatus(PaymentStatus.IDLE);
          isPollingRef.current = false;
        }
      } catch {
        pollTimer = setTimeout(poll, 4000);
      }
    };
    poll();
    return () => clearTimeout(pollTimer);
  }, [pendingOrderId, refetch]);

  // --- HANDLERS ---
  const handleEnrollment = async () => {
    const { status, orderData } = await enrollUserMutation.mutateAsync(courseId);
    if ([ENROLLMENT_STATUS.ALLREADY_ENROLLED, ENROLLMENT_STATUS.ENROLLED].includes(status)) {
      refetch();
      return;
    }
    const loaded = await loadRazorpay();
    if (!loaded) return toast.error("Payment Gateway failed to load");

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "LearnCircle",
      order_id: orderData.orderId,
      handler: (response: any) => {
        setPendingOrderId(response.razorpay_order_id);
        setPaymentStatus(PaymentStatus.PROCESSING);
      },
      modal: { ondismiss: () => setPaymentStatus(PaymentStatus.IDLE) },
      theme: { color: "#4f46e5" },
    };
    setPaymentStatus(PaymentStatus.PROCESSING);
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

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

  if (isLoading)
    return (
      <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.3em]">
        Synchronizing Elite Content...
      </div>
    );

  if (!courseData) return <div className="p-20 text-center font-black">COURSE NOT FOUND</div>;

  // --- ACCESS RESTRICTED UI ---
  if (!courseData.isEnrolled) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0b0f] flex items-center justify-center p-6 transition-colors">
        <PaymentStatusOverlay
          status={paymentStatus}
          onClose={() => setPaymentStatus(PaymentStatus.IDLE)}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8 p-12 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800"
        >
          <div className="relative inline-block">
            <Lock size={80} className="mx-auto text-indigo-600 mb-2" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full border-4 border-white dark:border-slate-900"
            />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
            {courseData.title}
          </h1>
          <p className="text-slate-500 font-bold">
            Access Restricted. Enroll now to unlock the full premium curriculum.
          </p>
          <button
            onClick={handleEnrollment}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:scale-[1.02] transition-transform uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20"
          >
            {courseData.type === "Free" ? "Enroll for Free" : "Purchase Course"}
          </button>
        </motion.div>
      </div>
    );
  }

  // --- ENROLLED UI ---
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
                <Clock size={12} /> Updated Recently
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-4 uppercase">
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
                  <Users size={18} className="text-indigo-600" />{" "}
                  {courseData.enrollmentCount?.toLocaleString() ?? 0}
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
                  {tab.label} {tab.isPremium && <Lock size={12} className="text-amber-500" />}
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
              transition={{ duration: 0.25, ease: "easeOut" }}
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
                <InstructorConnectComponent courseId={courseId} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnerCoursePage;
