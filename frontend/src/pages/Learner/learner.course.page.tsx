/* eslint-disable no-undef */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Lock, Star, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@mui/material";
import toast from "react-hot-toast";
import { useRef } from "react";

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

    if (isPollingRef.current) return; // ⛔ prevent duplicate loops
    isPollingRef.current = true;

    let pollTimer: ReturnType<typeof setTimeout>;
    const MAX_ATTEMPTS = 10;

    const poll = async () => {
      if (!pendingOrderId) {
        isPollingRef.current = false;
        return;
      }

      pollAttemptsRef.current += 1;
      console.log("Polling attempt:", pollAttemptsRef.current);

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
          toast.error("Payment verification timed out. Please refresh.");
          setPaymentStatus(PaymentStatus.IDLE);
          setPendingOrderId(null);
          pollAttemptsRef.current = 0;
          isPollingRef.current = false;
          return;
        }

        pollTimer = setTimeout(poll, 3000);
      } catch {
        if (pollAttemptsRef.current >= MAX_ATTEMPTS) {
          toast.error("Payment verification failed. Please try again.");
          setPaymentStatus(PaymentStatus.IDLE);
          setPendingOrderId(null);
          pollAttemptsRef.current = 0;
          isPollingRef.current = false;
          return;
        }

        pollTimer = setTimeout(poll, 4000);
      }
    };

    poll();

    return () => {
      clearTimeout(pollTimer);
    };
  }, [pendingOrderId, refetch, checkPaymentStatusMutation]);

  // --- HANDLERS ---
  const handleEnrollment = async () => {
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
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black animate-pulse">
        SYNCHRONIZING DATA...
      </div>
    );
  if (!courseData)
    return (
      <div className="h-screen flex items-center justify-center font-black">
        404: COURSE NOT FOUND
      </div>
    );

  if (!courseData.isEnrolled) {
    return (
      <>
        <PaymentStatusOverlay
          status={paymentStatus}
          onClose={() => setPaymentStatus(PaymentStatus.IDLE)}
        />
        <div className="min-h-screen bg-white dark:bg-[#0b0b0f] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-8">
            <Lock size={80} className="mx-auto text-indigo-600 animate-bounce" />
            <h1 className="text-4xl font-black uppercase">{courseData.title}</h1>
            <p className="text-slate-500">
              Access Restricted. Enroll now to unlock premium curriculum.
            </p>
            <button
              onClick={handleEnrollment}
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:scale-[1.02] transition-transform uppercase tracking-widest"
            >
              {courseData.type === "Free" ? "Enroll for Free" : "Purchase Course"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0b0b0f] text-slate-900 dark:text-slate-50 p-6 md:p-12">
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

        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <Badge className="bg-indigo-600 text-white mb-4">BESTSELLER</Badge>
            <h1 className="text-5xl font-black tracking-tighter mb-4">{courseData.title}</h1>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
              <span className="flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" /> {averageRating} ({reviews.length}
                )
              </span>
              <span className="flex items-center gap-2">
                <Users /> {courseData.enrollmentCount ?? 0} Learners
              </span>
            </div>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b w-full justify-start rounded-none mb-8">
              {["learning-path", "reviews", "instructor"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="uppercase font-black text-xs tracking-widest"
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
              >
                <TabsContent value="learning-path">
                  {courseData.chapters.map((chapter: any) => (
                    <LearnerChapterItem
                      key={chapter.id}
                      chapter={chapter}
                      onLessonSelect={(l) => setActiveLessonId(l.id)}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="grid gap-4">
                    {reviews.map((rev: any) => (
                      <ReviewItem
                        key={rev.id}
                        review={rev}
                        variant={rev.userId === currentUser?.id ? "author" : "viewer"}
                        onUpdate={(id, data) =>
                          courseUpdateMutation
                            .mutateAsync({ reviewId: id, payload: data })
                            .then(reviewRefetch)
                        }
                        onDelete={(id) => courseDeleteMutation.mutateAsync(id).then(reviewRefetch)}
                      />
                    ))}
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="border-2 border-dashed p-8 rounded-xl font-black uppercase text-xs opacity-50 hover:opacity-100 transition-opacity"
                    >
                      Add Your Review
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="instructor">
                  <InstructorConnectComponent courseId={courseId} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default LearnerCoursePage;
