import { z } from "zod";

// HH:mm 24-hour format
export const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");

// Day of week: 0 (Sun) to 6 (Sat)
export const dayOfWeek = z.number().int().min(0).max(6);

const Schema = z.object({
  daysOfWeek: z.array(dayOfWeek).min(1, "Select at least one day").max(7, "Too many days"),

  startTime: timeString,
  endTime: timeString,

  slotDuration: z.number().int().positive("slotDuration must be > 0"),

  price: z.number().nonnegative("price must be >= 0"),
});

export const CreateAvailabilitySchema = z.object({
  body: Schema,
});

export type CreateAvailabilitySchemaType = z.infer<typeof Schema>;
