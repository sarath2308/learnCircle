import { creatorCourseManageApi } from "@/api/creator/creator.course.manage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"


export const usePublishCourse = ()=>
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey:["course-publish"],
        mutationFn:(courseId: string)=>creatorCourseManageApi.publishCourse(courseId),
        onSuccess:()=>
        {
            toast.success("Course Published");
            queryClient.invalidateQueries({
             queryKey: ["creatorCourses"],
             });
        },
        onError:()=>
        {
            toast.error("Something went wrong, Course Not Published")
        }
    })
}