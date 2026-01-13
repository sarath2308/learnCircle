import { adminCourseManagement } from "@/api/admin/admin.course.manage"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useRejectCourse = () => {
    return useMutation({
        mutationFn: ({courseId, reason}: {courseId: string, reason: string}) => adminCourseManagement.rejectCourse(courseId, reason),
        onSuccess:()=>
        {
            toast.success("Course rejected successfully");
        },
        onError:()=>
        {
            toast.error("Failed to reject course, try again later");
        }
    },)
}