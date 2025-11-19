import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/api/admin/category.api";

interface ListCategoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface Category {
  id: string;
  name: string;
  isBlocked: boolean;
}

interface PaginatedResponse<T> {
  categoryData: T[];
  total: number;
}

export const useListCategory = ({ page = 1, limit = 10, search = "" }: ListCategoryParams) => {
  return useQuery<PaginatedResponse<Category>, Error>({
    queryKey: ["category", page, limit, search],
    queryFn: () => categoryApi.listCategory(page, limit, search),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
