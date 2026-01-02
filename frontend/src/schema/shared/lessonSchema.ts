import { z } from "zod";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
export const lessonSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Minimum 10 characters").optional(),
    type: z.nativeEnum(LESSON_TYPES),
    // eslint-disable-next-line no-undef
    file: z.instanceof(File).optional(),
    link: z.string().optional(),
    thumbnail: z
      // eslint-disable-next-line no-undef
      .instanceof(File, { message: "Thumbnail is required" })
      .refine((file) => file.type.startsWith("image/"), {
        message: "Thumbnail must be an image file",
      }),
  })
  .superRefine((data, ctx) => {
    const { type, file, link } = data;

    // File required check
    const needsFile = [LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(type);
    if (needsFile && !file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File is required for this lesson type",
        path: ["file"],
      });
    }

    // File type validation
    if (file) {
      if (type === LESSON_TYPES.VIDEO && !file.type.startsWith("video/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a valid video file",
          path: ["file"],
        });
      }
      if (type === LESSON_TYPES.PDF && file.type !== "application/pdf") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a valid PDF file",
          path: ["file"],
        });
      }
    }

    // Link required and URL validation
    const requiresLink = [LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(
      type,
    );
    if (requiresLink) {
      if (!link || link.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Link is required for this lesson type",
          path: ["link"],
        });
        return; // Early return to avoid URL parse on empty string
      }
      const trimmedLink = link.trim();
      const urlParse = z.string().url().safeParse(trimmedLink);
      if (!urlParse.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid URL",
          path: ["link"],
        });
      }
    }
  });

export type LessonSchema = z.infer<typeof lessonSchema>;
