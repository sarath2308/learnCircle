import { useQuery } from "@tanstack/react-query";
import { adminCategoryApi } from "@/api/admin/admin.category.api";

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
    queryKey: ["list-category", page, limit, search],
    queryFn: () => adminCategoryApi.listCategory(page, limit, search),
  });
};
