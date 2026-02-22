"use client";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Edit3, Save, Layers, Upload, Loader2, ShieldAlert } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import { AdminActionModal } from "@/components/admin/admin.action.modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hooks
import { useGetCourse } from "@/hooks/shared/course-creator/course.get";
import { useBlockCourse } from "@/hooks/admin/course/course.block";
import { useApproveCourse } from "@/hooks/admin/course/course.approve";
import { useUnblockCourse } from "@/hooks/admin/course/course.unblock";
import { useRejectCourse } from "@/hooks/admin/course/course.reject";
import { useCourseDetailsUpdate } from "@/hooks/shared/course/course.details.update";
import { useGetCategory } from "@/hooks/shared/category.get";
import { useGetSubCategories } from "@/hooks/shared/sub.category.get";

import ChapterItem, { type IChapter } from "@/components/shared/chapterItem";
import { useLessonUpdate } from "@/hooks/shared/lesson/lesson.update";
import { useChapterUpdate } from "@/hooks/shared/chapter/chapter.update";
import { useRemoveChapter } from "@/hooks/shared/chapter/chapter.remove";
import { useRemoveLesson } from "@/hooks/shared/lesson/lesson.remove";
import { Modal } from "../Modal";

type AdminAction = "block" | "reject" | "approve" | "unblock" | null;

interface IEditForm {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  skillLevel: string;
  price: number;
  discount: number;
}

export default function CourseReviewPage({ variant }: { variant: "admin" | "creator" }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [action, setAction] = useState<AdminAction>(null);
  const [reason, setReason] = useState("");
  const [modalOpen, setModalOpen] = useState();
  const [deleteModal, setDeleteModal] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const courseDetailsUpdate = useCourseDetailsUpdate();
  const chapterUpdate = useChapterUpdate();
  const deleteChapter = useRemoveChapter();

  // --- Form State ---
  const [editForm, setEditForm] = useState<IEditForm>({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    skillLevel: "",
    price: 0,
    discount: 0,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string>("");

  // --- Queries & Mutations ---
  const { data, isLoading, isError, refetch } = useGetCourse(id!);
  const { data: categoryList } = useGetCategory();

  // FIX: Passing editForm.category instead of hardcoded ID
  const { data: subCatData, isLoading: subLoading } = useGetSubCategories(editForm.category);

  const handleChapterUpdate = async (chapter: IChapter) => {
    await chapterUpdate.mutateAsync({
      chapterId: chapter.id,
      title: chapter.title,
      description: chapter.description,
    });
    refetch();
  };

  const handleChapterRemove = async (id: string) => {
    await deleteChapter.mutateAsync(id);
  };

  const handleCourseDetailsUpdate = async () => {
    const formData = new FormData();
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    if (editForm.title) {
      formData.append("title", editForm.title);
    }

    if (editForm.description) {
      formData.append("description", editForm.description);
    }

    if (editForm.category) {
      formData.append("category", editForm.category);
    }

    if (editForm.subCategory) {
      formData.append("subCategory", editForm.subCategory);
    }

    if (editForm.skillLevel) {
      formData.append("skillLevel", editForm.skillLevel);
    }
    if (editForm.price) {
      formData.append("price", String(editForm.price));
    }
    if (editForm.discount) {
      formData.append("discount", String(editForm.discount));
    }
    await courseDetailsUpdate.mutateAsync({ courseId: id!, payload: formData });
    setIsEditing(false);
    refetch();
  };

  const updateMutation = useCourseDetailsUpdate();
  const blockCourse = useBlockCourse();
  const approveCourse = useApproveCourse();
  const unblockCourse = useUnblockCourse();
  const rejectCourse = useRejectCourse();

  const subCategories = useMemo(() => subCatData?.subCategories ?? [], [subCatData]);

  useEffect(() => {
    if (data?.courseData) {
      const c = data.courseData;
      setEditForm({
        title: c.title,
        description: c.description,
        category: c.category?.id,
        subCategory: c.subCategory?.id,
        skillLevel: c.skillLevel,
        price: c.price || 0,
        discount: c.discount || 0,
      });
      setThumbPreview(c.thumbnailUrl);
    }
  }, [data, isEditing]);

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse font-bold text-slate-400">Loading Data...</div>
    );
  if (isError || !data?.courseData)
    return <div className="p-10 text-center text-red-500 font-bold">Failed to load course.</div>;

  const courseData = data.courseData;

  // --- Logic: Calculate Discounted Price ---
  const calculateSalePrice = (price: number, discountPercentage: number) => {
    if (!discountPercentage || discountPercentage <= 0) return price;
    const discountAmount = (price * discountPercentage) / 100;
    return Math.max(0, price - discountAmount).toFixed(2);
  };

  const handleConfirmAdminAction = async () => {
    switch (action) {
      case "approve":
        await approveCourse.mutateAsync(id!);
        break;
      case "block":
        await blockCourse.mutateAsync({ courseId: id!, reason });
        break;
      case "reject":
        await rejectCourse.mutateAsync({ courseId: id!, reason });
        break;
      case "unblock":
        await unblockCourse.mutateAsync(id!);
        break;
    }
    setAction(null);
    setReason("");
    refetch();
  };

  const handleSaveDetails = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([k, v]) => formData.append(k, String(v)));
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    await updateMutation.mutateAsync({ courseId: id!, payload: formData });
    setIsEditing(false);
    refetch();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-slate-950 min-h-screen font-sans text-slate-900 dark:text-slate-100 pb-20">
      <AdminActionModal
        open={!!action}
        action={action}
        reason={reason}
        loading={
          approveCourse.isPending ||
          blockCourse.isPending ||
          rejectCourse.isPending ||
          unblockCourse.isPending
        }
        setReason={setReason}
        onClose={() => setAction(null)}
        onConfirm={handleConfirmAdminAction}
      />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="gap-1 pl-0 text-muted-foreground mb-2 dark:hover:bg-slate-900"
          >
            <ChevronLeft size={16} /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Course Details" : "Course Review"}
          </h1>
        </div>

        {variant === "creator" && (
          <div className="flex gap-2">
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl dark:border-slate-800"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={isEditing ? handleCourseDetailsUpdate : () => setIsEditing(true)}
              className="rounded-xl font-bold shadow-sm px-6 bg-slate-900 dark:bg-indigo-600 text-white"
            >
              {updateMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : isEditing ? (
                <>
                  <Save onClick={handleCourseDetailsUpdate} size={18} className="mr-2" /> Save
                </>
              ) : (
                <>
                  <Edit3 size={18} className="mr-2" /> Edit
                </>
              )}
            </Button>
          </div>
        )}
      </header>

      {/* Thumbnail Section */}
      <div className="w-full h-80 rounded-3xl overflow-hidden shadow-lg mb-8 border border-gray-200 dark:border-slate-800 relative group">
        <img src={thumbPreview} alt="Thumbnail" className="w-full h-full object-cover" />
        {isEditing && (
          <label className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer">
            <Upload className="text-white mb-2" size={28} />
            <span className="text-white font-bold">Change Cover Image</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setThumbnailFile(file);
                  setThumbPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold">Title</Label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Description</Label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase">Category</Label>
                    <Select
                      value={editForm.category}
                      onValueChange={(v) =>
                        setEditForm({ ...editForm, category: v, subCategory: "" })
                      }
                    >
                      <SelectTrigger className="dark:bg-slate-800">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 z-[110]">
                        {categoryList?.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase">
                      Sub-Category
                    </Label>
                    <Select
                      value={editForm.subCategory}
                      disabled={!subCategories.length}
                      onValueChange={(v) => setEditForm({ ...editForm, subCategory: v })}
                    >
                      <SelectTrigger className="dark:bg-slate-800">
                        <SelectValue placeholder={subLoading ? "..." : "Select Sub-Category"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900 z-[110]">
                        {subCategories.map((sub: any) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase">Price ($)</Label>
                    <Input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="dark:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase">
                      Discount (%)
                    </Label>
                    <Input
                      type="number"
                      value={editForm.discount}
                      onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                      className="dark:bg-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase">
                      Skill Level
                    </Label>
                    <Select
                      value={editForm.skillLevel}
                      onValueChange={(v) => setEditForm({ ...editForm, skillLevel: v })}
                    >
                      <SelectTrigger className="dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900">
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{courseData.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {courseData.description}
                    </p>
                  </div>
                  <Badge className="ml-4 capitalize dark:bg-slate-800 bg-green-500">
                    {courseData.verificationStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Category</p>
                    <p className="font-semibold text-sm">{courseData.category?.name || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Level</p>
                    <p className="font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {courseData.skillLevel}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Pricing</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600 dark:text-green-400 text-sm">
                        ${calculateSalePrice(courseData.price, courseData.discount)}
                      </span>
                      {courseData.discount > 0 && (
                        <span className="text-[10px] line-through text-slate-300 dark:text-slate-600">
                          ${courseData.price} ({courseData.discount}% Off)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Content</p>
                    <p className="font-semibold text-sm">{courseData.chapterCount || 0} Chapters</p>
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold dark:text-slate-200">Course Curriculum</h3>
            {courseData.chapters?.map((chapter: any) => (
              <Accordion
                key={chapter.id}
                type="single"
                collapsible
                className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <ChapterItem chapter={chapter} variant={variant} />
              </Accordion>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-slate-400 uppercase tracking-widest">
                <Layers size={16} /> Instructor
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                  {courseData.createdBy?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{courseData.createdBy?.name}</p>
                  <p className="text-[11px] text-slate-400">{courseData.createdBy?.email}</p>
                </div>
              </div>
              <Separator className="my-4 dark:bg-slate-800" />
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-400 uppercase">Created</span>
                <span className="dark:text-slate-200">
                  {new Date(courseData.createdAt).toLocaleDateString()}
                </span>
              </div>
            </section>

            {variant === "admin" && (
              <section className="bg-slate-900 p-6 rounded-3xl shadow-xl space-y-3 text-white border border-slate-800">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-indigo-300">
                  <ShieldAlert size={16} /> Admin Controls
                </h3>
                {courseData.verificationStatus === "pending" && (
                  <div className="flex flex-col gap-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700 font-bold h-12 rounded-xl"
                      onClick={() => setAction("approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="font-bold h-12 rounded-xl"
                      onClick={() => setAction("reject")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                <Button
                  variant="outline"
                  className={`w-full h-12 rounded-xl font-bold border-white/10 hover:bg-white/5 ${courseData.isBlocked ? "text-blue-400" : "text-red-400"}`}
                  onClick={() => setAction(courseData.isBlocked ? "unblock" : "block")}
                >
                  {courseData.isBlocked ? "Unblock Course" : "Block Course"}
                </Button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
