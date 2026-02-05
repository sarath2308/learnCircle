import z from "zod";

const Params = z.object({
  availabilityId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid chapterId"),
});

export const RemoveAvailabilitySchema = z.object({
  params: Params,
});
