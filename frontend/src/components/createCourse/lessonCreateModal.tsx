"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import { 
  Video, 
  FileText, 
  Youtube, 
  Globe, 
  Image as ImageIcon, 
  X, 
  UploadCloud,
  Loader2
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "../Modal";
import { Label } from "../ui/label";
import { lessonSchema, type LessonSchema } from "@/schema/shared/lessonSchema";
import type { LessonType } from "@/types/shared/lesson.types";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
}

export default function LessonCreateModal({ open, onClose, onSubmit, isSubmitting = false }: Props) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

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

  const handleThumbnailChange = (file: File | undefined) => {
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      form.setValue("thumbnail", file, { shouldValidate: true });
    }
  };

  const handleTypeChange = (value: string) => {
    form.setValue("type", value as LessonType);
    form.clearErrors(["file", "link"]);
  };

  const processSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("type", data.type);
    if (data.file) formData.append("resource", data.file);
    if (data.link) formData.append("link", data.link);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    onSubmit(formData);
  });

  // Cleanup previews to avoid memory leaks
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  return (
    <Modal onClose={onClose} open={open} title="Create New Lesson">
      <form onSubmit={processSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        
        {/* Type Selection - Visual Tabs Style */}
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Content Type</Label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {Object.values(LESSON_TYPES).map((type) => {
              const isActive = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1.5 ${
                    isActive 
                    ? "border-blue-600 bg-blue-50/50 text-blue-600" 
                    : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  {getIconForType(type)}
                  <span className="text-[10px] font-bold uppercase tracking-tight">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Lesson Title</Label>
              <Input id="title" placeholder="Introduction to..." {...form.register("title")} className="h-12 rounded-xl" />
              <ErrorMessage message={form.formState.errors.title?.message} />
            </div>

            {/* Link Input (Conditional) */}
            {[LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(selectedType) && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label htmlFor="link" className="font-bold">Resource URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input id="link" placeholder="https://..." {...form.register("link")} className="pl-10 h-12 rounded-xl" />
                </div>
                <ErrorMessage message={form.formState.errors.link?.message} />
              </div>
            )}

            {/* File Upload (Conditional) */}
            {[LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(selectedType) && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label className="font-bold">Upload Resource</Label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-all">
                  <UploadCloud className="text-slate-400 mb-2" size={24} />
                  <span className="text-xs font-bold text-slate-500">
                    {form.watch("file")?.name || `Click to upload ${selectedType}`}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={selectedType === LESSON_TYPES.VIDEO ? "video/*" : ".pdf"}
                    onChange={(e) => form.setValue("file", e.target.files?.[0], { shouldValidate: true })} 
                  />
                </label>
                <ErrorMessage message={form.formState.errors.file?.message} />
              </div>
            )}
          </div>

          {/* Thumbnail & Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Lesson Thumbnail</Label>
              {!thumbnailPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all">
                  <ImageIcon className="text-slate-300" size={24} />
                  <span className="text-[10px] uppercase font-black text-slate-400 mt-2">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleThumbnailChange(e.target.files?.[0])} />
                </label>
              ) : (
                <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => { setThumbnailPreview(null); form.setValue("thumbnail", undefined); }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <ErrorMessage message={form.formState.errors.thumbnail?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Summary</Label>
              <Textarea id="description" rows={3} placeholder="What's this lesson about?" {...form.register("description")} className="rounded-xl resize-none" />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 dark:shadow-none"
          >
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing...</> : "Create Lesson"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Sub-components for cleaner JSX
function getIconForType(type: string) {
  switch (type) {
    case LESSON_TYPES.VIDEO: return <Video size={20} />;
    case LESSON_TYPES.YOUTUBE: return <Youtube size={20} />;
    case LESSON_TYPES.PDF: return <FileText size={20} />;
    case LESSON_TYPES.ARTICLE: return <Globe size={20} />;
    default: return <FileText size={20} />;
  }
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] font-bold text-red-500 animate-in fade-in slide-in-from-left-1">{message}</p>;
}