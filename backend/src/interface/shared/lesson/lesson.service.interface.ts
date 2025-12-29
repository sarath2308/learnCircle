import { CreateLessonDto } from "@/schema/shared/lesson/lesson.create.schema";
import { UploadedFile } from "../uploadFile.interface";
import { CreateLessonWithVideoDto } from "@/schema/shared/lesson/lesson.create.video.schema";
import { LessonResponseDto } from "@/schema/shared/lesson/lesson.response.schema";

export default interface ILessonService {
  createLesson: (
    chapterId: string,
    userId: string,
    lessonDto: CreateLessonDto,
    resourceData: UploadedFile,
    thumbnailData: UploadedFile,
  ) => Promise<LessonResponseDto>;
  getLessonById: (lessonId: string) => Promise<LessonResponseDto>;
  updateLesson: (lessonId: string, lessonDto: any) => Promise<LessonResponseDto>;
  deleteLesson: (lessonId: string) => Promise<void>;
  changeLessonOrder: (chapterId: string, lessonOrderDto: any) => Promise<void>;
  createLessonWithVideo: (
    chapterId: string,
    userId: string,
    lessonDto: CreateLessonWithVideoDto,
    thumbnailData: UploadedFile,
  ) => Promise<{ preSignedUrl: string; lessonData: LessonResponseDto }>;
}
