import { CreateChapterType } from "@/schema/shared/chapter/chapter.create.schema";
import { EditChapterType } from "@/schema/shared/chapter/chapter.edit.schema";
import { ChapterResponseType } from "@/schema/shared/chapter/chapter.response.schema";

export interface IChapterService {
  createChapter: (courseId: string, data: CreateChapterType) => Promise<ChapterResponseType>;
  getChapters: (courseId: string) => Promise<ChapterResponseType[]>;
  getChapter: (chapterId: string) => Promise<ChapterResponseType>;
  editChapter: (chapterId: string, data: EditChapterType) => Promise<ChapterResponseType>;
  removeChapter: (id: string) => Promise<{ chapterId: string }>;
}
