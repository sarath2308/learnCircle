
import { adminCourseManagement } from "@/api/admin/admin.course.manage";
import { useQuery } from "@tanstack/react-query"


export type AdminLessonResponseType = {
  chapterId: string;
  title: string;
  description: string;
  type: "Video" | "PDF" | "Article" | "YouTube" | "Blog";
  file_key: string;
  link: string | undefined;
  thumbnailUrl: string;
  mediaStatus: "ready" | "pending" | "uploaded" | "failed";
  order: number;
};


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
  category: string;
  skillLevel: string;
  price: number;
  type: string;
  createdAt: Date | string;

  thumbnailUrl: string | null;

  chapters: AdminChapterResponse[];
  isBlocked?: boolean;
  chapterCount: number;
  lessonCount: number;
}

export const useGetCourse = (courseId: string) =>{
    return useQuery({
        queryKey: ['get-course'],
        queryFn: () => adminCourseManagement.getCourse(courseId),
    })
}