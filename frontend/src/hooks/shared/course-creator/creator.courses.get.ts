import { creatorApi } from "@/api/shared/creatorApi";
import { useQuery } from "@tanstack/react-query";

export const useGetCreatorCourses = (filter: {
  priceType?: string | undefined;
  category?: string | undefined;
  skillLevel?: string | undefined;
  search?: string | undefined;
  status?: string | undefined;
}) => {
  return useQuery({
    queryKey: ["creatorCourses", filter],
    queryFn: () => creatorApi.getAllCoursesForCreator(filter),
  });
};
