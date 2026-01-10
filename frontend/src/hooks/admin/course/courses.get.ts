import { adminCourseManagement } from "@/api/admin/admon.course.manage";
import { useQuery } from "@tanstack/react-query";

export const useGetCourses = ({page,limit}:{page: number, limit: number})=>
{
    return useQuery({
        queryKey:["get-courses",page,limit],
        queryFn:()=> adminCourseManagement.getAllCourse(page,limit),
       placeholderData: (previousData) => previousData,
    })
};