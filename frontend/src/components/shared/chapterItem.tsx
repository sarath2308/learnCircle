"use client";

import { useState } from "react";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  LayoutList 
} from "lucide-react";

import { 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import LessonItem from "./lessonItem";
import LessonFormModal from "../createCourse/lesson.form.modal";
import { ResourceViewerModal } from "./ResourceViewModal";
import { UploadStatus } from "../createCourse/upload.status.progress";

import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import { useLessonCreateWithVideo } from "@/hooks/shared/lesson/lesson.create.video";
import { useUploadToS3 } from "@/hooks/shared/upload.s3.hook";
import { useLessonFinalize } from "@/hooks/shared/lesson/lesson.finalize";
import { useLessonCreate } from "@/hooks/shared/lesson/lesson.create";
import type { ILessons } from "@/interface/lesson.response.interface";

interface ChapterItemProps {
  chapter: {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: ILessons[];
  };
  onEdit?: () => void;
  onRemove?: () => void; // Renamed to match the prop passed from parent
  variant: "creator" | "admin" | "user";
}

const ChapterItem = ({ chapter, variant, onEdit, onRemove }: ChapterItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "compress" | "upload" | "finalize">("idle");
  const [modalData, setModalData] = useState<{ type: string; url?: string, title?:string, description?: string } | null>(null);

  // Hooks
  const createLessonWithVideo = useLessonCreateWithVideo();
  const lessonCreate = useLessonCreate();
  const uploadToS3 = useUploadToS3();
  const lessonFinalize = useLessonFinalize();

  const onAddLesson = async (lesson: FormData) => {
    setLessonSubmitting(true);
    try {
      const type = lesson.get("type");
      const file = lesson.get("resource") as File | null;
      const order = (chapter.lessons?.length || 0) + 1;
      lesson.set("order", order.toString());

      if (type === LESSON_TYPES.VIDEO) {
        if (!file) throw new Error("Video file missing");

        lesson.append("originalFileName", file.name);
        lesson.append("mimeType", file.type);

        const { preSignedUrl, lessonId } = await createLessonWithVideo.mutateAsync({
          chapterId: chapter.id,
          payload: lesson,
        });

        setStage("upload");
        await uploadToS3.mutateAsync({
          signedUrl: preSignedUrl,
          file: file,
          onProgress: (p) => setProgress(p),
        });

        setStage("finalize");
        await lessonFinalize.mutateAsync({ lessonId });
      } else {
        await lessonCreate.mutateAsync({
          chapterId: chapter.id,
          payload: lesson,
        });
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lesson creation failed:", err);
    } finally {
      setStage("idle");
      setProgress(0);
      setLessonSubmitting(false);
    }
  };

  return (
    <div className="mb-4 group">
      <ResourceViewerModal
        open={!!modalData}
        onClose={() => setModalData(null)}
        data={modalData}
      />
      
      {stage !== "idle" && <UploadStatus progress={progress} stage={stage} />}
      
      <LessonFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddLesson}
        isSubmitting={lessonSubmitting}
      />

      <AccordionItem 
        value={chapter.id} 
        className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 px-4 transition-all hover:shadow-md"
      >
        <div className="flex items-center gap-2">
          <AccordionTrigger className="flex-1 hover:no-underline py-6">
            <div className="flex items-center gap-4 text-left">
              <div className="flex flex-col items-center justify-center h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 font-black text-slate-500 text-xs border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase opacity-50">CH</span>
                {chapter.order}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                  {chapter.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {chapter.lessons?.length || 0} Lessons • Content Management
                </p>
              </div>
            </div>
          </AccordionTrigger>

          {/* ACTIONS FOR CREATOR */}
          {variant === "creator" && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-400 hover:text-blue-600"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onEdit?.(); 
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onRemove?.(); 
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <AccordionContent className="pb-6 pt-2">
          <div className="space-y-1 ml-2 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
            {!chapter.lessons || chapter.lessons.length === 0 ? (
              <div className="flex flex-col items-center py-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <LayoutList className="text-slate-300 mb-2" size={32} />
                <p className="text-sm text-slate-500 font-medium">No lessons published yet</p>
              </div>
            ) : (
              chapter.lessons.map((lesson) => (
                <LessonItem 
                  key={lesson.id} 
                  lesson={lesson} 
                  setModalData={setModalData} 
                  variant={variant}
                />
              ))
            )}

            {variant === "creator" && (
              <div className="pt-4">
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full h-12 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/10 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:border-blue-200 font-bold rounded-xl transition-all flex gap-2"
                >
                  <Plus size={18} strokeWidth={3} />
                  Add Lesson to Chapter {chapter.order}
                </Button>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export default ChapterItem;