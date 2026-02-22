import z from "zod";

const body = z.object({
  date: z.coerce.date(),
});

export const ExceptionCreateSchema = z.object({
  body: body,
});

export type ExceptionCreateDataType = z.infer<typeof body>;
