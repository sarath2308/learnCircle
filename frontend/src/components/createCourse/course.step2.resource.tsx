"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "../ui/button";
import { Modal } from "../Modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Accordion } from "@/components/ui/accordion";
import ChapterItem from "../shared/chapterItem";

import {
  ChapterSchema,
  type ChapterSchemaType,
} from "@/schema/shared/create.course.chapter.schema";
import { useChapterCreate } from "@/hooks/shared/chapter/chapter.create";

import type { RootState } from "@/redux/store";
import { useChapterUpdate } from "@/hooks/shared/chapter/chapter.update";
import { useRemoveChapter } from "@/hooks/shared/chapter/chapter.remove";

interface IStep2Props {
  handleNext: () => void;
  handlePrev: () => void;
}

const Step2Resources = ({ handleNext, handlePrev }: IStep2Props) => {
  // --- States ---
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  const chapterData = useSelector((state: RootState) => state.chapter.chapters);
  const courseId = useSelector((state: RootState) => state.courseDetails.id);

  const createChapter = useChapterCreate();
  const updateChapter = useChapterUpdate();
  const deleteChapter = useRemoveChapter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChapterSchemaType>({
    resolver: zodResolver(ChapterSchema),
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (editingChapter) {
      setValue("title", editingChapter.title);
      setValue("description", editingChapter.description);
    } else {
      reset({ title: "", description: "" });
    }
  }, [editingChapter, setValue, reset]);

  // --- Handlers ---
  const handleEditTrigger = (chapter: any) => {
    setEditingChapter(chapter);
    setModalOpen(true);
  };

  const handleRemoveTrigger = (chapterId: string) => {
    setChapterToDelete(chapterId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!chapterToDelete || !courseId) return;
    try {
      await deleteChapter.mutateAsync(chapterToDelete);
      toast.success("Chapter removed");
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete chapter");
    } finally {
      setChapterToDelete(null);
    }
  };

  const onSubmit = async (data: ChapterSchemaType) => {
    if (!courseId) {
      toast.error("Course ID missing.");
      return;
    }

    try {
      if (editingChapter) {
        await updateChapter.mutateAsync({
          chapterId: editingChapter.id,
          title: data.title,
          description: data.description,
        });
        toast.success("Chapter updated");
      } else {
        await createChapter.mutateAsync({
          courseId,
          title: data.title,
          description: data.description,
          order: chapterData.length + 1,
        });
        toast.success("Chapter added");
      }
      setModalOpen(false);
      setEditingChapter(null);
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 dark:text-slate-100">
      <div className="flex items-center justify-between border-b pb-6 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Curriculum Builder</h2>
          <p className="text-sm text-slate-500 font-medium">
            Plan your course structure and add lessons
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingChapter(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 gap-2 shadow-lg"
        >
          <Plus size={18} strokeWidth={3} /> New Chapter
        </Button>
      </div>

      <div className="min-h-[300px]">
        {chapterData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <BookOpen size={32} className="text-blue-600 mb-4" />
            <h3 className="text-lg font-bold">No chapters yet</h3>
            <Button
              variant="outline"
              onClick={() => setModalOpen(true)}
              className="mt-4 rounded-xl font-bold"
            >
              Add First Chapter
            </Button>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {chapterData.map((chapter) => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                variant="creator"
                onEdit={() => handleEditTrigger(chapter)}
                onRemove={() => handleRemoveTrigger(chapter.id)}
              />
            ))}
          </Accordion>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-10 border-t dark:border-slate-800">
        <Button variant="ghost" onClick={handlePrev} className="font-bold text-slate-500">
          <ChevronLeft size={18} className="mr-2" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={chapterData.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 rounded-xl"
        >
          Continue to Pricing <ChevronRight size={18} className="ml-2" />
        </Button>
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        title={editingChapter ? "Edit Chapter" : "Add New Chapter"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingChapter(null);
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Chapter Title</Label>
              <Input
                {...register("title")}
                className="h-12 rounded-xl dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.title && (
                <p className="text-xs font-bold text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Learning Objectives</Label>
              <Textarea
                {...register("description")}
                rows={4}
                className="rounded-xl dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.description && (
                <p className="text-xs font-bold text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white font-black px-6 rounded-xl"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                <Sparkles className="mr-2" size={18} />
              )}
              {editingChapter ? "Update Chapter" : "Build Chapter"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        title="Remove Chapter"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="flex flex-col items-center text-center p-4">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
          <p className="text-slate-500 text-sm mb-6">
            This will permanently delete the chapter and all associated lessons. This action cannot
            be undone.
          </p>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="flex-1 rounded-xl font-bold bg-red-600"
            >
              {/* Add your delete hook's pending state here if applicable */}
              Delete Chapter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Step2Resources;
