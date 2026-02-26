/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Star,
  Users,
  PlayCircle,
  CheckCircle2,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Hooks & Components
import { useGetLearnerCourse } from "@/hooks/learner/course/learner.course.get.hook";
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
import type { RootState } from "@/redux/store";

const LearnerCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (!courseId) throw new Error("Course ID is missing");

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("learning-path");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.IDLE);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const pollAttemptsRef = useRef(0);
  const isPollingRef = useRef(false);

  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  // --- API HOOKS ---
  const { data, isLoading, refetch } = useGetLearnerCourse(courseId);
  const { data: courseReview, refetch: reviewRefetch } = useGetCourseReviewForView(courseId);

  const courseReviewMutation = useCourseReviewCreate();
  const courseUpdateMutation = useCourseReviewUpdate();
  const courseDeleteMutation = useDeleteCourseReview();
  const enrollUserMutation = useEnrollUser();
  const checkPaymentStatusMutation = useGetPaymentStatus();

  const courseData = data?.courseData;
  const reviews = courseReview?.reviews ?? [];
  const averageRating = courseReview?.averageRating ?? 0;

  // --- DERIVED DATA ---
  const activeLesson = useMemo(() => {
    if (!activeLessonId || !courseData) return null;
    for (const chapter of courseData.chapters) {
      const lesson = chapter.lessons.find((l: any) => l.id === activeLessonId);
      if (lesson) return lesson;
    }
    return null;
  }, [activeLessonId, courseData]);

  // --- PAYMENT POLLING EFFECT ---
  useEffect(() => {
    if (!pendingOrderId) return;
    if (isPollingRef.current) return;

    isPollingRef.current = true;
    let pollTimer: ReturnType<typeof setTimeout>;
    const MAX_ATTEMPTS = 10;

    const poll = async () => {
      if (!pendingOrderId) {
        isPollingRef.current = false;
        return;
      }
      pollAttemptsRef.current += 1;

      try {
        const res = await checkPaymentStatusMutation.mutateAsync(pendingOrderId);
        if (res.paymentStatus === "PAID") {
          setPaymentStatus(PaymentStatus.SUCCESS);
          setPendingOrderId(null);
          pollAttemptsRef.current = 0;
          isPollingRef.current = false;
          refetch();
          return;
        }

        if (res.paymentStatus === "FAILED" || res.paymentStatus === "CANCELLED") {
          setPaymentStatus(PaymentStatus.FAILED);
          setPendingOrderId(null);
          pollAttemptsRef.current = 0;
          isPollingRef.current = false;
          return;
        }

        if (pollAttemptsRef.current >= MAX_ATTEMPTS) {
          toast.error("Payment verification timed out.");
          setPaymentStatus(PaymentStatus.IDLE);
          setPendingOrderId(null);
          isPollingRef.current = false;
          return;
        }
        pollTimer = setTimeout(poll, 3000);
      } catch {
        pollTimer = setTimeout(poll, 4000);
      }
    };

    poll();
    return () => clearTimeout(pollTimer);
  }, [pendingOrderId, refetch, checkPaymentStatusMutation]);

  // --- HANDLERS ---
  const handleEnrollment = async () => {
    try {
      const { status, orderData } = await enrollUserMutation.mutateAsync(courseId);

      if (status === ENROLLMENT_STATUS.ALLREADY_ENROLLED || status === ENROLLMENT_STATUS.ENROLLED) {
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
    } catch {
      toast.error("Enrollment failed. Try again.");
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#050505]">
        <div className="w-16 h-1 bg-indigo-600 animate-[loading_1.5s_ease-in-out_infinite]" />
        <span className="mt-4 font-black tracking-[0.3em] text-[10px] uppercase text-slate-400">
          Synchronizing Curriculum
        </span>
      </div>
    );

  if (!courseData)
    return (
      <div className="h-screen flex items-center justify-center font-black text-2xl uppercase tracking-tighter">
        404 // Course Asset Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#050505] text-slate-900 dark:text-slate-50 transition-colors duration-300 pb-20">
      <PaymentStatusOverlay
        status={paymentStatus}
        onClose={() => setPaymentStatus(PaymentStatus.IDLE)}
      />

      {/* --- HERO SECTION --- */}
      <section className="bg-white dark:bg-[#0b0b0f] border-b border-slate-200 dark:border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  Bestseller
                </span>
                <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  {courseData.type} Access
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase break-words">
                {courseData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={`${s <= Math.round(averageRating) ? "fill-amber-500 text-amber-500" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <span className="font-black text-lg">{averageRating}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    ({reviews.length} Verified Reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 font-bold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                  <Users size={18} className="text-indigo-600" />
                  <span>{courseData.enrollmentCount?.toLocaleString() ?? 0} Enrolled</span>
                </div>
              </div>
            </div>

            {/* Price/CTA Card */}
            {!courseData.isEnrolled && (
              <div className="w-full lg:w-[400px] sticky top-8 bg-white dark:bg-slate-900 border-[3px] border-slate-900 dark:border-slate-700 p-8 shadow-[12px_12px_0px_0px_rgba(79,70,229,1)]">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-xs font-black uppercase text-slate-400">Course Value</span>
                  <span className="text-5xl font-black uppercase tracking-tighter">
                    {courseData.type === "Free" ? "FREE" : "$199"}
                  </span>
                </div>

                <button
                  onClick={handleEnrollment}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 uppercase tracking-[0.2em] transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                  Get Started Now <ChevronRight size={20} />
                </button>

                <div className="mt-8 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  {[
                    { icon: <ShieldCheck size={18} />, text: "Full Lifetime Access" },
                    { icon: <Award size={18} />, text: "Certificate of Completion" },
                    { icon: <Globe size={18} />, text: "Access on Mobile and TV" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400"
                    >
                      <span className="text-indigo-500">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- CONTENT GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex gap-10 bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none w-full justify-start h-auto p-0 mb-12">
                {["learning-path", "reviews", "instructor"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 border-b-4 border-transparent rounded-none px-0 py-4 text-[11px] font-black uppercase tracking-[0.25em] transition-all bg-transparent"
                  >
                    {tab.replace("-", " ")}
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="learning-path" className="space-y-4 outline-none">
                    {courseData.chapters.map((chapter: any, index: number) => (
                      <div key={chapter.id} className="relative pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800" />
                        <div className="absolute left-[-4px] top-6 w-3 h-3 bg-indigo-600 rounded-full ring-4 ring-white dark:ring-slate-900" />
                        <LearnerChapterItem
                          chapter={{ ...chapter, index: index + 1 }}
                          onLessonSelect={(l) => setActiveLessonId(l.id)}
                        />
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="reviews" className="outline-none">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                      <h3 className="text-3xl font-black uppercase tracking-tighter">
                        Community Feedback
                      </h3>
                      <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:invert transition-all"
                      >
                        Leave a Review
                      </button>
                    </div>
                    <div className="grid gap-6">
                      {reviews.length > 0 ? (
                        reviews.map((rev: any) => (
                          <ReviewItem
                            key={rev.id}
                            review={rev}
                            variant={rev.userId === currentUser?.id ? "author" : "viewer"}
                            onUpdate={(id, payload) =>
                              courseUpdateMutation
                                .mutateAsync({ reviewId: id, payload })
                                .then(reviewRefetch)
                            }
                            onDelete={(id) =>
                              courseDeleteMutation.mutateAsync(id).then(reviewRefetch)
                            }
                          />
                        ))
                      ) : (
                        <div className="py-24 text-center border-4 border-dashed border-slate-100 dark:border-slate-900 rounded-[3rem]">
                          <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                          <p className="font-black uppercase tracking-widest text-slate-400">
                            No reviews yet
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="instructor" className="outline-none">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                      <InstructorConnectComponent courseId={courseId} />
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Right Column (Insights Sidebar) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Progress Card */}
            <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <BarChart3 className="mb-6 opacity-60" size={32} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">
                  Course Mastery
                </h4>
                <div className="text-6xl font-black mb-6 tracking-tighter">00%</div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "5%" }}
                    className="bg-white h-full"
                  />
                </div>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-widest opacity-70">
                  {courseData.chapters.length} Chapters remaining
                </p>
              </div>
              <PlayCircle className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Curriculum Stats */}
            <div className="border-2 border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] space-y-8">
              <h4 className="font-black uppercase text-xs tracking-[0.2em] border-b border-slate-100 dark:border-slate-800 pb-4">
                What's included
              </h4>
              <div className="space-y-6">
                {[
                  { icon: <BookOpen size={18} />, label: "Lessons", value: "48 HD Videos" },
                  { icon: <Clock size={18} />, label: "Duration", value: "18.5 Total Hours" },
                  {
                    icon: <CheckCircle2 size={18} />,
                    label: "Projects",
                    value: "3 Build-along apps",
                  },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="text-indigo-600">{stat.icon}</span>
                      <span className="text-[11px] font-black uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xs font-black">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- OVERLAYS --- */}
      <Modal open={!!activeLessonId} onClose={() => setActiveLessonId(null)}>
        {activeLesson && <UniversalLessonStage lesson={activeLesson} />}
      </Modal>

      <ReviewModal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={(r, c) =>
          courseReviewMutation
            .mutateAsync({ courseId, payload: { rating: r, comment: c ?? "" } })
            .then(() => {
              setIsReviewModalOpen(false);
              reviewRefetch();
            })
        }
      />
    </div>
  );
};

export default LearnerCoursePage;
