import { IChapter } from "@/model/shared/chapter.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface IChapterRepo extends IBaseRepo<IChapter> {
  removeChapter: (chapterId: string) => Promise<void>;
  getChapters: (courseId: string) => Promise<IChapter[]>;
  getChapterWithTitle: (title: string, courseId: string) => Promise<IChapter | null>;
  increseLessonCount: (chapterId: string) => Promise<IChapter | null>;
  decreaseLessonCount: (chapterId: string) => Promise<IChapter | null>;
  findById: (chapterId: string) => Promise<IChapter | null>;
}
