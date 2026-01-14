"use client";

import { useState } from "react";
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
  Loader2
} from "lucide-react";

import { Button } from "../ui/button";
import { Modal } from "../Modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Accordion } from "@/components/ui/accordion";
import ChapterItem from "../shared/chapterItem";

import { ChapterSchema, type ChapterSchemaType } from "@/schema/shared/create.course.chapter.schema";
import { useChapterCreate } from "@/hooks/shared/chapter/chapter.create";
import type { RootState } from "@/redux/store";

interface IStep2Props {
  handleNext: () => void;
  handlePrev: () => void;
}

const Step2Resources = ({ handleNext, handlePrev }: IStep2Props) => {
  const [createChapterModal, setCreateChapterModal] = useState(false);
  
  const chapterData = useSelector((state: RootState) => state.chapter.chapters);
  const courseId = useSelector((state: RootState) => state.courseDetails.id);
  const createChapter = useChapterCreate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChapterSchemaType>({
    resolver: zodResolver(ChapterSchema),
    defaultValues: { title: "", description: "" }
  });

  const onSubmit = async (data: ChapterSchemaType) => {
    if (!courseId) {
      toast.error("Course ID missing. Please go back to Step 1.");
      return;
    }

    try {
      await createChapter.mutateAsync({
        courseId,
        title: data.title,
        description: data.description,
        order: chapterData.length + 1,
      });
      
      toast.success("Chapter added successfully");
      setCreateChapterModal(false);
      reset(); // Clear form
    } catch (err) {
      toast.error("Failed to create chapter");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b pb-6 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Curriculum Builder</h2>
          <p className="text-sm text-slate-500 font-medium">Plan your course structure and add lessons</p>
        </div>
        <Button 
          onClick={() => setCreateChapterModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} strokeWidth={3} />
          New Chapter
        </Button>
      </div>

      {/* Chapters List */}
      <div className="min-h-[300px]">
        {chapterData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-bold">No chapters yet</h3>
            <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
              Every great course starts with a structure. Create your first chapter to begin.
            </p>
            <Button variant="outline" onClick={() => setCreateChapterModal(true)} className="rounded-xl border-2 font-bold">
              Add First Chapter
            </Button>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {chapterData.map((chapter) => (
              <ChapterItem key={chapter.id} chapter={chapter} variant="creator" />
            ))}
          </Accordion>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-10 border-t dark:border-slate-800">
        <Button 
          variant="ghost" 
          onClick={handlePrev}
          className="font-bold gap-2 text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft size={18} /> Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={chapterData.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 rounded-xl gap-2 transition-all"
        >
          Continue to Pricing <ChevronRight size={18} />
        </Button>
      </div>

      {/* Create Modal */}
      <Modal 
        title="Add New Chapter" 
        open={createChapterModal} 
        onClose={() => setCreateChapterModal(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Chapter Title</Label>
              <Input 
                {...register("title")}
                placeholder="e.g. Getting Started with React" 
                className="h-12 rounded-xl focus:ring-blue-500"
              />
              {errors.title && <p className="text-xs font-bold text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Learning Objectives</Label>
              <Textarea 
                {...register("description")}
                placeholder="What will students learn in this chapter?" 
                rows={4}
                className="rounded-xl resize-none"
              />
              {errors.description && <p className="text-xs font-bold text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setCreateChapterModal(false)} className="font-bold">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 rounded-xl"
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Sparkles className="mr-2" size={18} />}
              Build Chapter
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Step2Resources;