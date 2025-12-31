import { chapterApi } from "@/api/shared/chapterApi";
import { useMutation } from "@tanstack/react-query";

export const useChapterUpdate = () => {
  return useMutation({
    mutationKey: ["update-chapter"],
    mutationFn: ({ chapterId, payload }: { chapterId: string; payload: FormData }) =>
      chapterApi.updateChapter(chapterId, payload),
  });
};
