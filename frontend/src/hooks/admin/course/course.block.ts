import { adminCourseManagement } from "@/api/admin/admin.course.manage"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useBlockCourse = () => {
    return useMutation({
        mutationFn: ({courseId, reason}: {courseId: string, reason: string}) => adminCourseManagement.blockCourse(courseId, reason),
        onSuccess:()=>
        {
            toast.success("Course blocked successfully");
        },
        onError:()=>
        {
            toast.error("Failed to Block course, try again later");
        }
    },)
}