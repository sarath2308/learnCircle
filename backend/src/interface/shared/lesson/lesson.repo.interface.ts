import { ILesson } from "@/model/shared/lesson.model";
import { IBaseRepo } from "@/repos/shared/base";

export default interface ILessonRepo extends IBaseRepo<ILesson> {
  findLessonsByChapterId(chapterId: string): Promise<ILesson[]>;
  findLessonByTitleAndChapterId(title: string, chapterId: string): Promise<ILesson | null>;
  updateLessonMediaStatus(
    lessonId: string,
    status: "ready" | "pending" | "uploaded" | "failed",
  ): Promise<void>;
  updateThumbnailKey(lessonId: string, thumbnailKey: string): Promise<void>;
  findById(id: string): Promise<ILesson | null>;
  getLessonsByChapterIds: (chapterArray: Array<string>) => Promise<ILesson[]>;
}
