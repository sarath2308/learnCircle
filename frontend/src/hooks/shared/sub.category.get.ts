import { subCategoryApi } from "@/api/shared/sub.category.api"
import { useQuery } from "@tanstack/react-query"

export const useGetSubCategories = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: ["subCategories", categoryId],
    queryFn: () => subCategoryApi.getSubCategories(categoryId!),
    enabled: !!categoryId,
  })
}
