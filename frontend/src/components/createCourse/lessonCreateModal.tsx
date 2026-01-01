import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema } from "@/schema/shared/lessonSchema";
import type { LessonSchema } from "@/schema/shared/lessonSchema";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";

// shadcn/ui imports
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LessonSchema) => void;
}

export default function LessonCreateModal({ open, onClose, onSubmit }: Props) {
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      type: LESSON_TYPES.VIDEO,
      file: undefined,
      link: "",
      thumbnail: null,
    },
  });

  const selectedType = form.watch("type");

  const handleSubmit = (data: LessonSchema) => {
    // if VIDEO/PDF and missing file
    if ([LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(data.type) && !data.file) {
      form.setError("file", { message: "File is required for this type" });
      return;
    }

    // if LINK types and missing link
    if (
      [LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(data.type) &&
      !data.link
    ) {
      form.setError("link", { message: "Link is required" });
      return;
    }

    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Input placeholder="Title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
          )}

          <Textarea placeholder="Description" {...form.register("description")} />

          <Select onValueChange={(v) => form.setValue("type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LESSON_TYPES.VIDEO}>Video</SelectItem>
              <SelectItem value={LESSON_TYPES.PDF}>PDF</SelectItem>
              <SelectItem value={LESSON_TYPES.ARTICLE}>Article</SelectItem>
              <SelectItem value={LESSON_TYPES.YOUTUBE}>YouTube</SelectItem>
              <SelectItem value={LESSON_TYPES.BLOG}>Blog</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-red-500 text-sm">{form.formState.errors.type.message}</p>
          )}

          {/* CONDITIONAL FIELDS */}
          {[LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(selectedType) && (
            <Input
              type="file"
              accept="video/*,.pdf"
              onChange={(e) => form.setValue("file", e.target.files?.[0] || undefined)}
            />
          )}

          {[LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(
            selectedType,
          ) && <Input placeholder="Resource Link" {...form.register("link")} />}

          {form.formState.errors.link && (
            <p className="text-red-500 text-sm">{form.formState.errors.link.message}</p>
          )}

          {/* Thumbnail */}
          <Input
            type="file"
            onChange={(e) => form.setValue("thumbnail", e.target.files?.[0] || null)}
          />
          {form.formState.errors.thumbnail && (
            <p className="text-red-500 text-sm">{form.formState.errors.thumbnail.message}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Lesson</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
