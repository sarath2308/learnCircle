import z from "zod";
import { dayOfWeek } from "./availability.create.schema";

export const AvailabilityResponseSchema = z.object({
  id: z.string(),
  instructorId: z.string(),
  dayOfWeek: dayOfWeek,
  startTime: z.string(),
  endTime: z.string(),
  slotDuration: z.number(),
  price: z.number(),
  isActive: z.boolean(),
});

export type AvailabilityResponseType = z.infer<typeof AvailabilityResponseSchema>;
