import { useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "../Modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ChapterSchema } from "@/schema/shared/create.course.chapter.schema";
import { AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import ChapterItem from "../shared/chapterItem";
import { useChapterCreate } from "@/hooks/shared/chapter/chapter.create";
import toast from "react-hot-toast";
import { Accordion } from "@radix-ui/react-accordion";

interface IStep2Props {
  handleNext: () => void;
  handlePrev: () => void;
}
const Step2Resources = ({ handleNext, handlePrev }: IStep2Props) => {
  const chapterData = useSelector((state: RootState) => state.chapter.chapters);
  const courseId = useSelector((state: RootState) => state.courseDetails.id);
  const createChapter = useChapterCreate();

  const [createChapterModal, setCreateChapterModal] = useState(false);
  const [chapterCreate, setChapterCreate] = useState({
    title: "",
    description: "",
  });
  const [chapterError, setChapterErrors] = useState({
    title: "",
    description: "",
  });
  const createChapterValidation = () => {
    const result = ChapterSchema.safeParse(chapterCreate);

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;

      setChapterErrors({
        title: flat.title?.[0] || "",
        description: flat.description?.[0] || "",
      });

      return false;
    }

    setChapterErrors({
      title: "",
      description: "",
    });

    return true;
  };

  const handleCreateChapter = async () => {
    if (!courseId) {
      toast.error("course ID is missing | course not created yet");
      return;
    }
    if (!createChapterValidation()) return;
    const formData = new FormData();
    formData.append("title", chapterCreate.title);
    formData.append("description", chapterCreate.description);
    formData.append("order", (chapterData.length + 1).toString());

    try {
      toast.success(courseId);
      await createChapter.mutateAsync({
        courseId,
        title: chapterCreate.title,
        description: chapterCreate.description,
        order: chapterData.length + 1,
      });
      setCreateChapterModal(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleNextValidate = () => {
    handleNext();
  };

  return (
    <>
      <div>
        <div className="flex justify-end">
          <Button className="bg-blue-500" onClick={() => setCreateChapterModal(true)}>
            + Create Chapter
          </Button>
        </div>

        <div className="p-4">
         <Modal
  title="Create Chapter"
  open={createChapterModal}
  onClose={() => setCreateChapterModal(false)}
>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleCreateChapter();
    }}
    className="space-y-6"
  >
    <div className="space-y-4">
      <div>
        <Label htmlFor="chapter-title" className="dark:text-white">Title</Label>
        <Input
          id="chapter-title"
          autoFocus
          placeholder="Enter a title..."
          value={chapterCreate.title}
          className="focus-visible:ring-blue-500 focus-visible:ring-4 dark:text-white"
          onChange={(e) =>
            setChapterCreate((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        {chapterError.title && (
          <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {chapterError.title}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="chapter-description" className="dark:text-white">Description</Label>
        <Textarea
          id="chapter-description"
          rows={6}
          placeholder="Enter a description..."
          className="focus-visible:ring-blue-500 focus-visible:ring-4 dark:text-white"
          value={chapterCreate.description}
          onChange={(e) =>
            setChapterCreate((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        {chapterError.description && (
          <p className="text-sm text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {chapterError.description}
          </p>
        )}
      </div>
    </div>

    <div className="flex justify-end gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        className="bg-red-400 dark:text-white"
        onClick={() => setCreateChapterModal(false)}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="default"
        className="bg-blue-500 dark:text-white"
        disabled={createChapter.isPending} // add a state for this
      >
        {createChapter.isPending ? "Creating..." : "Create Chapter"}
      </Button>
    </div>
  </form>
</Modal>
        </div>
        <div>
          <Accordion type="single" collapsible>
            {chapterData.length === 0 ? (
              <p className="text-center text-gray-500">No chapters added yet.</p>
            ) : (
              chapterData.map((chapter, index) => (
                <ChapterItem key={chapter.id} chapter={chapter} variant="creator"></ChapterItem>
              ))
            )}
          </Accordion>
        </div>
        <div className="mt-8 flex justify-between">
          <Button className="bg-blue-500" onClick={handlePrev}>
            Prev
          </Button>
          <Button className="bg-green-500 " onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Step2Resources;
