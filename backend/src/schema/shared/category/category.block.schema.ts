import { z } from "zod";
import { CategoryParamsSchema } from "./category.update.schema";
export const CategoryBlockSchema = z.object({
  params: CategoryParamsSchema,
});
