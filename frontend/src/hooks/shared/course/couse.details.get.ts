
import { courseApi } from "@/api/shared/course.api"
import { useQuery } from "@tanstack/react-query"

export interface ICourseDetailsResponse
{
    success: boolean;
    courseData:{
        title: string;
        description: string;
        category: string;
        subCateagory: string;
        skillLevel: "beginner" | "intermediate" | "advanced" | "";
        thumbnailUrl: string;
        price: number;
        type: string;
        discount: number;
    }
}
export const useGetCoureDetails = (courseId: string) =>
{
    return useQuery({
        queryKey:["get-course"],
        queryFn:async () => {
          let result: ICourseDetailsResponse = await courseApi.getCourse(courseId)
          return result;
        }

    })
}