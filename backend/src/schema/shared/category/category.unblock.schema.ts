import { z } from "zod";
import { CategoryParamsSchema } from "./category.update.schema";
export const CategoryUnBlockSchema = z.object({
  params: CategoryParamsSchema,
});
