import { LEARNER_COURSE_API } from "@/api/learner/learner.course.api";
import { useQuery } from "@tanstack/react-query";

export interface LearnerLessonResponseType {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  type: "Video" | "PDF" | "Article" | "YouTube" | "Blog";
  fileUrl?: string;
  link?: string;
  thumbnailUrl: string;
  order: number;
}

export interface LearnerChapterResponse {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LearnerLessonResponseType[];
  lessonCount: number;
}

export interface LearnerCourseData {
  id: string;
  title: string;
  description: string;
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

export const useGetLearnerCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["get-learner-course"],
    queryFn: () => LEARNER_COURSE_API.getLearnerCourse(courseId),
  });
};
