import { chapterApi } from "@/api/shared/chapterApi";
import { addChapter } from "@/redux/slice/course/chapterSlice";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export const useChapterCreate = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["create-chapter"],
    mutationFn: ({
      courseId,
      title,
      description,
      order,
    }: {
      courseId: string;
      title: string;
      description: string;
      order: number;
    }) => chapterApi.createChapter(courseId, { title, description, order }),

    onSuccess: (data) => {
      dispatch(addChapter(data.chapterData));
      toast.success("Chapter created");
    },

    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Chapter Not Created");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
