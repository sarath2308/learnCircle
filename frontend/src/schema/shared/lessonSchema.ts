import { z } from "zod";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";

export const lessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.nativeEnum(LESSON_TYPES, { message: "Select a lesson type" }),
  // eslint-disable-next-line no-undef
  file: z.instanceof(File).optional(),
  link: z.string().url("Enter a valid URL").optional(),
  // eslint-disable-next-line no-undef
  thumbnail: z.instanceof(File, { message: "Thumbnail is required" }).nullable(),
});

export type LessonSchema = z.infer<typeof lessonSchema>;
