import { creatorApi } from "@/api/shared/creatorApi"
import {  useQuery } from "@tanstack/react-query"

export const useGetCreatorCourses = () => {
    return useQuery({
        queryKey: ["creatorCourses"],
        queryFn: () => creatorApi.getAllCoursesForCreator(),
    })
}