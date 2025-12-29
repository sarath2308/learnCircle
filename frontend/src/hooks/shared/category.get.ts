import { categoryApi } from "@/api/shared/category.api"
import { useQuery } from "@tanstack/react-query"

type CategoryDataType={
    id: string;
    name: string;
    isBlocked?:boolean;
}

export const useGetCategory = () => {
  return useQuery<CategoryDataType[]>({
    queryKey: ["get-category"],
    queryFn: async () => {
      const res = await categoryApi.getCategory();
      return res.categoryData;
    },
    staleTime: 5 * 60 * 1000,
  });
};
