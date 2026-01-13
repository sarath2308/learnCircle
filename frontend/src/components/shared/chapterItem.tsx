import { AccordionItem, AccordionTrigger, AccordionContent, Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { ILessons } from "@/interface/lesson.response.interface";
import { Pencil, Trash2 } from "lucide-react";
import LessonItem from "./lessonItem";
import LessonCreateModal from "../createCourse/lessonCreateModal";
import { useState } from "react";
import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import { useLessonCreateWithVideo } from "@/hooks/shared/lesson/lesson.create.video";
import { useUploadToS3 } from "@/hooks/shared/upload.s3.hook";
import { UploadStatus } from "../createCourse/upload.status.progress";
import { useLessonFinalize } from "@/hooks/shared/lesson/lesson.finalize";
import { useLessonCreate } from "@/hooks/shared/lesson/lesson.create";
import { ResourceViewerModal } from "./ResourceViewModal";

interface ChapterItemProps {
  chapter: {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: ILessons[];
  };
  variant?: "creator" | "admin" | "user";
}

const ChapterItem = ({ chapter,variant }: ChapterItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createLessonWithVideo = useLessonCreateWithVideo();
  const lessonCreate = useLessonCreate();
  const uploadToS3 = useUploadToS3();
  const lessonFinalize = useLessonFinalize();
  const [lessonSubmiting,setLessonSubmiting] = useState(false)
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "compress" | "upload" | "finalize">("idle");
const [modalData, setModalData] = useState<{
  type: string;
  url?: string;
} | null>(null);
  const onEdit = (chapterData: { id: string; title: string; description: string }) => {
    console.log("Edit chapter:", chapterData);
  };

  const onDelete = (chapterId: string) => {
    console.log("Delete chapter with ID:", chapterId);
  };

  const onAddLesson = async (lesson: FormData) => {
    setLessonSubmiting(true);
    try {
      const type = lesson.get("type");
      const file = lesson.get("resource") as File | null;

      const order = chapter.lessons?.length ? chapter.lessons.length + 1 : 1;

      lesson.set("order", order.toString());

      if (type === LESSON_TYPES.VIDEO) {
        if (!file) {
          console.error("Video file missing");
          return;
        }

        lesson.append("originalFileName", file.name);
        lesson.append("mimeType", file.type);

        const { preSignedUrl, lessonId } = await createLessonWithVideo.mutateAsync({
          chapterId: chapter.id,
          payload: lesson,
        });
        setStage("compress");
        // eslint-disable-next-line no-undef
        await new Promise((r) => setTimeout(r, 0));

        setStage("upload");
        await uploadToS3.mutateAsync({
          signedUrl: preSignedUrl,
          file: file,
          onProgress: (p) => setProgress(p),
        });

        setStage("finalize");
        await lessonFinalize.mutateAsync({ lessonId });

        setStage("idle");
        setProgress(0);
      }

      // Non-video
      await lessonCreate.mutateAsync({
        chapterId: chapter.id,
        payload: lesson,
      });
    } catch (err) {
      console.error("Lesson creation failed:", err);
    } finally {
      // ✅ ALWAYS runs
      setIsModalOpen(false);
      setStage("idle");
      setProgress(0);
      setLessonSubmiting(false);
    }
  };

  return (
    <>
    
<ResourceViewerModal
  open={!!modalData}
  onClose={() => setModalData(null)}
  data={modalData}
/>
      <UploadStatus progress={progress} stage={stage} />
      <LessonCreateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddLesson}
        isSubmitting={lessonSubmiting}
      />

      <AccordionItem value={chapter.id} className="w-4xl p-3">
        <div className="flex items-center justify-between">
          <AccordionTrigger className="flex-1 text-left py-4 px-2 font-semibold">
            chapter {chapter.order} :{chapter.title}
          </AccordionTrigger>
          {variant === "creator" && 

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-200"
              onClick={() => onEdit(chapter)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-red-200"
              onClick={() => onDelete(chapter.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
}
        </div>

        <AccordionContent>
          {!chapter.lessons || chapter.lessons.length === 0 ? (
            <p className="text-gray-500 italic">No lessons added yet.</p>
          ) : (
            chapter.lessons.map((lesson) => (
              <LessonItem key={lesson.id} lesson={lesson} setModalData={(data:{type: string; url?: string}) => setModalData(data)} variant="creator" />
            ))
          )}
           <div className="flex justify-end">
            {variant === "creator" &&
            <Button className="bg-green-500" onClick={() => setIsModalOpen(true)}>
              {" "}
              +Add Lesson
            </Button>
            }
          </div>

        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default ChapterItem;
