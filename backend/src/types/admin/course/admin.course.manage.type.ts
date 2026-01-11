import { AdminLessonResponseType } from "@/schema/admin/course/lesson.response";

export interface AdminChapterResponse {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: AdminLessonResponseType[];
  lessonCount: number;
}

export interface AdminCourseDetailsResponse {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdBy: {
    name?: string;
    role?: string;
  };
  createdAt: Date | string;

  thumbnailUrl: string | null;

  chapters: AdminChapterResponse[];

  chapterCount: number;
  lessonCount: number;
}
