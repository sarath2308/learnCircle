import { courseStep1Api } from "@/api/shared/course.create.step1.api";
import { resetChapterState } from "@/redux/slice/chapterSlice";
import { resetCourseDetails } from "@/redux/slice/courseDetails";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export const useCourseUpdatePrice = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ["update-course-price"],
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: string;
      payload: { type: string; price: number; discount: number; status: string };
    }) => courseStep1Api.updatePriceDetails(courseId, payload),
    onSuccess(data) {
      toast.success("course created successfully");
      dispatch(resetCourseDetails());
      dispatch(resetChapterState());
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Course Not Created");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
