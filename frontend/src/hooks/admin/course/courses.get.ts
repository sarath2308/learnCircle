import { adminCourseManagement } from "@/api/admin/admon.course.manage";
import { useQuery } from "@tanstack/react-query";

export const useGetCourses = ()=>
{
    return useQuery({
        queryKey:["get-courses"],
        queryFn:adminCourseManagement.getAllCourse,
        
    })
}