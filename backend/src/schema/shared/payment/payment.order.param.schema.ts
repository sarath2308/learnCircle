import z from "zod";

export const PaymentParamsSchema = z.object({
  params: z.object({
    orderId: z.string(),
  }),
});
