import { z } from "zod";

export const pricingSchema = z
  .object({
    isFree: z.boolean(),
    price: z.number().min(0, "Price cannot be negative"),
    discount: z
      .number()
      .min(0, "Discount cannot be less than 0")
      .max(100, "Discount cannot exceed 100%"),
    status: z.enum(["draft", "published"]),
  })
  .superRefine((data, ctx) => {
    if (!data.isFree && data.price <= 0) {
      ctx.addIssue({
        path: ["price"],
        message: "Paid courses must have a price greater than 0",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.isFree && (data.price > 0 || data.discount > 0)) {
      ctx.addIssue({
        path: ["price"],
        message: "Free courses cannot have price or discount",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type PricingFormData = z.infer<typeof pricingSchema>;
