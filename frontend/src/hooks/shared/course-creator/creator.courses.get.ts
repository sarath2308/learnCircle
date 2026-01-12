import { creatorApi } from "@/api/shared/creatorApi"
import {  useQuery } from "@tanstack/react-query"

export const useGetCreatorCourses = (status: string) => {
    return useQuery({
        queryKey: ["creatorCourses",status],
        queryFn: () => creatorApi.getAllCoursesForCreator(status),
    })
}