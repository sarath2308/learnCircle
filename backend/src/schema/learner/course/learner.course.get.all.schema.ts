import z from "zod";

const Params = z.object({
  categoryId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId")
    .optional(),

  subCategoryId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid subCategoryId")
    .optional(),

  type: z.enum(["Free", "Paid"]).optional(),

  search: z.string().optional(),

  sortPrice: z.coerce
    .number()
    .int()
    .refine((v) => v === 1 || v === -1)
    .optional(),
  sortDate: z.coerce
    .number()
    .int()
    .refine((v) => v === 1 || v === -1)
    .optional(),
  sortRating: z.coerce
    .number()
    .int()
    .refine((v) => v === 1 || v === -1)
    .optional(),
});

export const LearnerAllCourseRequestSchema = z.object({
  params: Params,
});

export type LearnerAllCourseRequestType = z.infer<typeof Params>;
