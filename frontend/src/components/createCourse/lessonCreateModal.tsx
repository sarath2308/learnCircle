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
import Modal from "../Modal";
import { Label } from "@radix-ui/react-label";
import { lessonSchema, type LessonSchema } from "@/schema/shared/lessonSchema";
import type { LessonType } from "@/types/shared/lesson.types";
import { useEffect } from "react";

/* ------------------- COMPONENT ------------------- */
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
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
      // eslint-disable-next-line no-undef
      thumbnail: undefined as File | undefined,
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
    formData.append("thumbnail", data.thumbnail); // required

    if (data.link) formData.append("link", data.link);

    onSubmit(formData);
  });

  /* RESET FIELDS WHEN TYPE CHANGES */
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
    <Modal isOpen={open} onClose={onClose} onSave={() => handleSubmit()}>
      <form className="space-y-5">
        {/* TITLE */}
        <div>
          <Label htmlFor="title">Title</Label>
          <div className="space-y-1">
            <Input id="title" placeholder="Title" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <Label htmlFor="description">Description</Label>
          <div className="space-y-1">
            <Textarea
              id="description"
              placeholder="Description"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
            )}
          </div>
        </div>

        {/* TYPE */}
        <div>
          <Label htmlFor="type">Lesson Type</Label>
          <div className="space-y-1">
            <Select value={selectedType} onValueChange={(v) => handleTypeChange(v)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LESSON_TYPES).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-red-500 text-sm">{form.formState.errors.type.message}</p>
            )}
          </div>
        </div>

        {/* CONDITIONAL FILE INPUT */}
        {[LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(selectedType) && (
          <div>
            <Label htmlFor="file">Upload File</Label>
            <div className="space-y-1">
              <Input
                id="file"
                type="file"
                accept="video/*,.pdf"
                onChange={(e) =>
                  form.setValue("file", e.target.files?.[0], { shouldValidate: true })
                }
              />
              {form.formState.errors.file?.message && (
                <p className="text-red-500 text-sm">{form.formState.errors.file?.message}</p>
              )}
            </div>
          </div>
        )}

        {/* CONDITIONAL LINK INPUT */}
        {[LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(selectedType) && (
          <div>
            <Label htmlFor="link">Resource Link</Label>
            <div className="space-y-1">
              <Input id="link" placeholder="Resource link" {...form.register("link")} />
              {form.formState.errors.link && (
                <p className="text-red-500 text-sm">{form.formState.errors.link.message}</p>
              )}
            </div>
          </div>
        )}

        {/* THUMBNAIL */}
        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <div className="space-y-1">
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return; // ❌ block undefined
                form.setValue("thumbnail", file, { shouldValidate: true }); // ✔ always File
              }}
            />
            {form.formState.errors.thumbnail?.message && (
              <p className="text-red-500 text-sm">{form.formState.errors.thumbnail?.message}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
