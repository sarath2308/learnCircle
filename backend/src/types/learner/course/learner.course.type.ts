import { LearnerLessonResponseType } from "@/schema/learner/course/lesson/learner.lesson.response";

export interface LearnerChapterResponse {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: LearnerLessonResponseType[];
  lessonCount: number;
}

export interface LearnerCourseResponse {
  id: string;
  title: string;
  description?: string;
  category: {
    id: string;
    name: string;
  };
  skillLevel: string;
  createdBy: {
    name?: string;
    role?: string;
  };
  price?: number;
  discount?: number;
  type: string;
  createdAt: Date | string;

  thumbnailUrl: string | null;

  chapters: LearnerChapterResponse[] | [];

  chapterCount: number;
  lessonCount: number;
}
