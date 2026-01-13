import { LESSON_TYPES } from "@/contstant/shared/lesson.type";
import type { ILessons } from "@/interface/lesson.response.interface";
import { Pencil, Trash2 } from "lucide-react";

interface ILessonProps {
  lesson: ILessons;
  setModalData: (data: { type: string; url?: string }) => void;
  variant?: "creator" | "admin" | "user";
}

const LessonItem = ({ lesson, setModalData, variant }: ILessonProps) => {
  const editLesson = (lessonData: ILessons) => {
    console.log("Edit lesson:", lessonData);
  };
  const deleteLesson = (lessonId: string) => {
    console.log("Delete lesson with ID:", lessonId);
  };

  const handleOpenResource = () => {
    switch (lesson.type) {
      case LESSON_TYPES.VIDEO:
        return setModalData({ type: lesson.type, url: lesson.fileUrl });

      case LESSON_TYPES.PDF:
        return setModalData({ type: lesson.type, url: lesson.fileUrl });

      case LESSON_TYPES.ARTICLE:
        return setModalData({ type: lesson.type, url: lesson.link });

      case LESSON_TYPES.YOUTUBE:
        return setModalData({ type: lesson.type, url: lesson.link });
      case LESSON_TYPES.BLOG:
        return window.open(lesson.link, "_blank");

      default:
        console.warn("Unknown type");
    }
  };

  return (
    <div className="flex items-center justify-between border p-3 rounded-lg mt-2 w-md">
      {/* Left: Icon + Info */}
      <div className="flex gap-3 items-center">
        <img
          src={lesson.thumbnailUrl}
          className="w-10 h-10 rounded-md object-cover cursor-pointer"
          onClick={() => handleOpenResource()}
        />

        <div>
          <h4 className="font-medium text-sm">{lesson.title}</h4>
          <p className="text-xs text-gray-600">{lesson.type}</p>
        </div>
      </div>

      {/* Right: Status + Actions */}
      {variant === "creator" && 
      <div className="flex items-center gap-3">
        <button onClick={() => editLesson(lesson)}>
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => deleteLesson(lesson.id)}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
}
    </div>
  );
};

export default LessonItem;
