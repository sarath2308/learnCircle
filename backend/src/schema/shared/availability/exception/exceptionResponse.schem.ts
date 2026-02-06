import z from "zod";

export const AvailabilityExceptionResponseSchema = z.object({
  id: z.string(),
  date: z.string(),
});

export type AvailabilityExceptionResponseType = z.infer<typeof AvailabilityExceptionResponseSchema>;
