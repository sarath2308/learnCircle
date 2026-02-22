import { z } from "zod";

// HH:mm 24-hour format
export const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format");

// Day of week: 0 (Sun) to 6 (Sat)
export const dayOfWeek = z.number().int().min(0).max(6);

const Params = z.object({
  availabilityId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid chapterId"),
});

const Schema = z.object({
  daysOfWeek: z.number().optional(),

  startTime: timeString.optional(),
  endTime: timeString.optional(),

  slotDuration: z.number().int().positive("slotDuration must be > 0").optional(),

  price: z.number().nonnegative("price must be >= 0").optional(),
});

export const UpdateAvailabilitySchema = z.object({
  params: Params,
  body: Schema,
});

export type UpdateAvailabilitySchemaType = z.infer<typeof Schema>;
