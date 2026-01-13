import { adminCourseManagement } from "@/api/admin/admin.course.manage"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useApproveCourse = () => {
    return useMutation({
        mutationFn: (courseId: string) => adminCourseManagement.approveCourse(courseId),
        onSuccess:()=>
        {
            toast.success("Course approved successfully");
        },
        onError:(err)=>
        {
            toast.error("Failed to approve course, try again later");
        }
    })
}