import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { ILessons } from "@/interface/lesson.response.interface";
import { Pencil, Trash2 } from "lucide-react";
import LessonItem from "./lessonItem";
import type { LessonSchema } from "@/schema/shared/lessonSchema";
import LessonCreateModal from "./lessonCreateModal";
import { useState } from "react";

interface ChapterItemProps {
  chapter: {
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: ILessons[];
  };
}

const ChapterItem = ({ chapter }: ChapterItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onEdit = (chapterData: { id: string; title: string; description: string }) => {
    console.log("Edit chapter:", chapterData);
  };

  const onDelete = (chapterId: string) => {
    console.log("Delete chapter with ID:", chapterId);
  };

  const onAddLesson = async (lesson: LessonSchema) => {
    console.log("Add lesson to chapter with ID:", chapter.id, "Lesson data:", lesson);
  }
  return (
    <>
    <LessonCreateModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={onAddLesson} />
    <AccordionItem value={chapter.id}>
      <div className="flex items-center justify-between">
        <AccordionTrigger className="flex-1 text-left py-4 px-2 font-semibold">
          chapter {chapter.order} :{chapter.title}
        </AccordionTrigger>

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
      </div>

      <AccordionContent>
        <div className="flex justify-end">
          <Button className="bg-green-500" onClick={() => setIsModalOpen(true)}> +Add Lesson</Button>
        </div>

        {!chapter.lessons || chapter.lessons.length === 0 ? (
          <p className="text-gray-500 italic">No lessons added yet.</p>
        ) : (
          chapter.lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} setModalData={() => {}} />
          ))
        )}
      </AccordionContent>
    </AccordionItem>
    </>
    
  );
};

export default ChapterItem;
