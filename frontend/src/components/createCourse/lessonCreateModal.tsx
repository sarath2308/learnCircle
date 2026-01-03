import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // ← You were missing this import
import { Modal } from "../Modal";
import { Label } from "../ui/label";
import { lessonSchema, type LessonSchema } from "@/schema/shared/lessonSchema";
import type { LessonType } from "@/types/shared/lesson.types";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
}

export default function LessonCreateModal({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      type: LESSON_TYPES.VIDEO,
      file: undefined,
      link: "",
      thumbnail: undefined,
    },
    mode: "onChange",
  });

  const selectedType = form.watch("type");

  const handleSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("type", data.type);

    if (data.file) formData.append("resource", data.file);
    if (data.link) formData.append("link", data.link);

    // thumbnail is required per your schema, so it should always exist if valid
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    onSubmit(formData);
  });

  const handleTypeChange = (value: string) => {
    form.setValue("type", value as LessonType, { shouldValidate: true });
    form.setValue("file", undefined, { shouldValidate: true });
    form.setValue("link", "", { shouldValidate: true });
  };

  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        description: "",
        type: LESSON_TYPES.VIDEO,
        file: undefined,
        link: "",
        thumbnail: undefined,
      });
    }
  }, [open, form]);

  return (
    <Modal onClose={onClose} open={open} title="Create Lesson">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter lesson title"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe the lesson"
            rows={4}
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive text-red-500">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Lesson Type</Label>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select lesson type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LESSON_TYPES).map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-destructive text-red-500">
              {form.formState.errors.type.message}
            </p>
          )}
        </div>

        {/* File Upload - Video/PDF */}
        {[LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(selectedType) && (
          <div className="space-y-2">
            <Label htmlFor="file">
              Upload {selectedType === LESSON_TYPES.VIDEO ? "Video" : "PDF"}
            </Label>
            <Input
              id="file"
              type="file"
              accept={
                selectedType === LESSON_TYPES.VIDEO ? "video/mp4,video/webm" : ".pdf"
              }
              onChange={(e) =>
                form.setValue("file", e.target.files?.[0] ?? undefined, {
                  shouldValidate: true,
                })
              }
            />
            {form.formState.errors.file && (
              <p className="text-sm text-destructive text-red-500">
                {form.formState.errors.file.message}
              </p>
            )}
          </div>
        )}

        {/* Link - YouTube/Blog/Article */}
        {[LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(
          selectedType
        ) && (
          <div className="space-y-2">
            <Label htmlFor="link">Resource Link</Label>
            <Input
              id="link"
              placeholder="https://..."
              {...form.register("link")}
            />
            {form.formState.errors.link && (
              <p className="text-sm text-destructive text-red-500">
                {form.formState.errors.link.message}
              </p>
            )}
          </div>
        )}

        {/* Thumbnail */}
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) =>
              form.setValue("thumbnail", e.target.files?.[0] as File, {
                shouldValidate: true,
              })
            }
          />
          {form.formState.errors.thumbnail && (
            <p className="text-sm text-destructive text-red-500">
              {form.formState.errors.thumbnail.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Lesson"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}