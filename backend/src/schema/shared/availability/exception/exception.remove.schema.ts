import z from "zod";

const Params = z.object({
  exceptionId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid ExceptionId"),
});

export const ExceptionRemoveSchema = z.object({
  params: Params,
});
