"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import { 
  Video, FileText, Youtube, Globe, 
  Image as ImageIcon, X, UploadCloud, Loader2 
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
  initialData?: {
    title: string;
    description?: string;
    type: LessonType;
    link?: string;
    fileUrl?: string; 
    thumbnailUrl?: string;
  };
}

export default function LessonFormModal({ 
  open, 
  onClose, 
  onSubmit, 
  isSubmitting = false, 
  initialData 
}: Props) {
  const isEditMode = !!initialData;
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialData?.thumbnailUrl || null);
  const [fileSelected, setFileSelected] = useState(false);
  const [thumbnailSelected, setThumbnailSelected] = useState(false);

  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || LESSON_TYPES.VIDEO,
      link: initialData?.link || "",
      file: undefined,
      thumbnail: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: initialData?.title || "",
        description: initialData?.description || "",
        type: initialData?.type || LESSON_TYPES.VIDEO,
        link: initialData?.link || "",
      });
      setThumbnailPreview(initialData?.thumbnailUrl || null);
      setFileSelected(false);
      setThumbnailSelected(false);
    }
  }, [initialData, form, open]);

  const selectedType = form.watch("type");

  const handleThumbnailChange = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        form.setError("thumbnail", { message: "File must be an image" });
        return;
      }
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailSelected(true);
      form.setValue("thumbnail", file);
      form.clearErrors("thumbnail");
    }
  };

  const handleProcessSubmit = form.handleSubmit((data) => {
    let hasError = false;

    // 1. Manual Validation: Link-based types
    if ([LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(selectedType)) {
      if (!data.link || data.link.trim() === "") {
        form.setError("link", { message: "Resource URL is required" });
        hasError = true;
      } else {
        try {
          new URL(data.link);
        } catch {
          form.setError("link", { message: "Please enter a valid URL" });
          hasError = true;
        }
      }
    }

    // 2. Manual Validation: File-based types (Presence + Type)
    if ([LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(selectedType)) {
      const file = data.file as File | undefined;
      const hasExistingFile = !!initialData?.fileUrl;
      const isNewUpload = fileSelected && !!file;

      if (!hasExistingFile && !isNewUpload) {
        form.setError("file", { message: `Please upload a ${selectedType} file` });
        hasError = true;
      } else if (isNewUpload) {
        // Validation for NEW uploads only
        if (selectedType === LESSON_TYPES.VIDEO && !file.type.startsWith("video/")) {
          form.setError("file", { message: "Invalid video format" });
          hasError = true;
        }
        if (selectedType === LESSON_TYPES.PDF && file.type !== "application/pdf") {
          form.setError("file", { message: "File must be a PDF" });
          hasError = true;
        }
      }
    }

    if (hasError) return;

    // Construction of FormData
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("type", data.type);
    
    // Only send files to API if they were actually changed by the user
    if (fileSelected && data.file) {
      formData.append("resource", data.file);
    }
    
    if (thumbnailSelected && data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    if (data.link) formData.append("link", data.link);

    onSubmit(formData);
  });

  return (
    <Modal onClose={onClose} open={open} title={isEditMode ? "Edit Lesson" : "Create New Lesson"}>
      <form onSubmit={handleProcessSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Content Type</Label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {Object.values(LESSON_TYPES).map((type) => {
              const isActive = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    form.setValue("type", type as LessonType);
                    form.clearErrors(["file", "link"]);
                  }}
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
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold">Lesson Title</Label>
              <Input id="title" {...form.register("title")} className="h-12 rounded-xl" placeholder="Enter lesson title..." />
              <ErrorMessage message={form.formState.errors.title?.message} />
            </div>

            {[LESSON_TYPES.YOUTUBE, LESSON_TYPES.BLOG, LESSON_TYPES.ARTICLE].includes(selectedType) && (
              <div className="space-y-2">
                <Label htmlFor="link" className="font-bold">Resource URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input id="link" {...form.register("link")} className="pl-10 h-12 rounded-xl" placeholder="https://..." />
                </div>
                <ErrorMessage message={form.formState.errors.link?.message} />
              </div>
            )}

            {[LESSON_TYPES.VIDEO, LESSON_TYPES.PDF].includes(selectedType) && (
              <div className="space-y-2">
                <Label className="font-bold">Upload Resource</Label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900/50 border-slate-200 hover:bg-slate-100 transition-all">
                  <UploadCloud className="text-slate-400 mb-2" size={24} />
                  <span className="text-xs font-bold text-slate-500 px-4 text-center truncate w-full">
                    {form.watch("file")?.name || (isEditMode && !fileSelected ? "Using existing file" : `Upload ${selectedType}`)}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={selectedType === LESSON_TYPES.VIDEO ? "video/*" : ".pdf"}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) {
                            setFileSelected(true);
                            form.setValue("file", file);
                            form.clearErrors("file");
                        }
                    }} 
                  />
                </label>
                <ErrorMessage message={form.formState.errors.file?.message} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Lesson Thumbnail</Label>
              <div className="relative h-32 rounded-xl overflow-hidden border border-slate-200 group">
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Preview" />
                    <button 
                      type="button"
                      onClick={() => { 
                        setThumbnailPreview(null); 
                        setThumbnailSelected(true);
                        form.setValue("thumbnail", undefined); 
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-50 transition-all">
                    <ImageIcon className="text-slate-300" size={24} />
                    <span className="text-[10px] uppercase font-black text-slate-400 mt-2">Upload Image</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleThumbnailChange(e.target.files?.[0])} />
                  </label>
                )}
              </div>
              <ErrorMessage message={form.formState.errors.thumbnail?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Summary</Label>
              <Textarea id="description" rows={3} {...form.register("description")} className="rounded-xl resize-none" placeholder="What will students learn?" />
              <ErrorMessage message={form.formState.errors.description?.message} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">Cancel</Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 font-bold"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditMode ? "Updating..." : "Creating..."}</>
            ) : (
              isEditMode ? "Save Changes" : "Create Lesson"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

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
  return (
    <p className="text-[11px] font-bold text-red-500 animate-in fade-in slide-in-from-left-1">
      {message}
    </p>
  );
}