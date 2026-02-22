import { z } from "zod";
import { CategoryParamsSchema } from "../category.update.schema";
export const SubCategoryUnBlockSchema = z.object({
  params: CategoryParamsSchema,
});
