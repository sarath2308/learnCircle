import { useQuery } from "@tanstack/react-query";
import { adminSubCategoryApi } from "@/api/admin/admin.sub.category";

interface ListCategoryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  category:{
    id: string; name: string;
  }
  isBlocked: boolean;
}

interface PaginatedResponse<T> {
  subCategoryData: T[];
  total: number;
}

export const useListSubCategory = ({ page = 1, limit = 10, search = "", categoryId }: ListCategoryParams) => {
  return useQuery<PaginatedResponse<Category>, Error>({
    queryKey: ["list-sub-category", page, limit, search, categoryId],
    queryFn: () => adminSubCategoryApi.listSubCategory(page, limit, search, categoryId? categoryId : ""),
  });
};
