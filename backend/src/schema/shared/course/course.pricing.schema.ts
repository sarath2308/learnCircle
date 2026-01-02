import z from "zod";

const bodySchema = z
  .object({
    type: z.enum(["Free", "Paid"]),

    price: z.number(),

    discount: z.number(),

    status: z.enum(["draft", "published"]),
  })
  .superRefine((data, ctx) => {
    if (data.type === "Paid") {
      if (!data.price) {
        ctx.addIssue({
          path: ["price"],
          message: "Price is required for paid courses",
          code: "custom",
        });
      } else {
        const value = Number(data.price);
        if (value < 1) {
          ctx.addIssue({
            path: ["price"],
            message: "Price must be at least 1",
            code: "custom",
          });
        }
      }
    }

    if (data.discount !== undefined) {
      const discountNum = Number(data.discount);
      if (discountNum < 0 || discountNum > 100) {
        ctx.addIssue({
          path: ["discount"],
          message: "Discount must be between 0 and 100",
          code: "custom",
        });
      }
    }
  });

export const courseParams = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid categoryId"),
});

export const coursePriceSchema = z.object({
  body: bodySchema,
  params: courseParams,
});

export type CoursePriceDtoType = z.infer<typeof bodySchema>;
