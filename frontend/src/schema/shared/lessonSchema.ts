import { z } from "zod";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";

export const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // We keep this here because description length is a static rule
  description: z.string().min(10, "Minimum 10 characters").or(z.literal("")).optional(),
  type: z.nativeEnum(LESSON_TYPES),
  // We mark these as any/optional so Zod stays out of the way
  file: z.any().optional(),
  link: z.string().optional(),
  thumbnail: z.any().optional(),
});

export type LessonSchema = z.infer<typeof lessonSchema>;
