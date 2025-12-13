import { IChapter } from "@/model/shared/chapter.model";
import { IBaseRepo } from "@/repos/shared/base";

export interface IChapterRepo extends IBaseRepo<IChapter> {
  remove: (id: string) => Promise<void>;
  getChapters: (courseId: string) => Promise<IChapter[]>;
  getChapterWithTitle: (title: string, courseId: string) => Promise<IChapter | null>;
}
