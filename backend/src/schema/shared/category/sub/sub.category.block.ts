import { z } from "zod";
import { CategoryParamsSchema } from "../category.update.schema";
export const SubCategoryBlockSchema = z.object({
  params: CategoryParamsSchema,
});
