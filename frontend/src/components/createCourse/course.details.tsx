"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload, X, Loader2, ChevronRight, Layers } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Logic
import type { Step1Errors } from "@/types/shared/course.step1.error.type";
import { Step1Schema } from "@/schema/shared/create.course.step1.schema";
import { useGetCategory } from "@/hooks/shared/category.get";
import { useCreateCourse } from "@/hooks/shared/course/create.course.step1";
import { useCourseDetailsUpdate } from "@/hooks/shared/course/course.details.update";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCourseDetails } from "@/redux/slice/course/courseDetails";
import { useGetSubCategories } from "@/hooks/shared/sub.category.get";

interface CourseDetailsProps {
  handleNext: () => void;
}

const skillLevels = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
] as const;

const CourseDetails = ({ handleNext }: CourseDetailsProps) => {
  const dispatch = useDispatch();
  const courseDetails = useSelector((state: RootState) => state.courseDetails);
  const isEdit = !!courseDetails.id;

  // Data Fetching
  const { data: categoryData, isLoading: categoriesLoading } = useGetCategory();
  const { data: subCategoryData, isLoading: subLoading } = useGetSubCategories(
    courseDetails.category,
  );

  // Memoize subcategories to prevent unnecessary re-renders
  const subCategories = useMemo(() => subCategoryData?.subCategories ?? [], [subCategoryData]);

  const createCourse = useCreateCourse();
  const updateCourseDetails = useCourseDetailsUpdate();

  // Local State
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Step1Errors>({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    skillLevel: "",
    thumbnail: "",
  });

  // 1. Sync Thumbnail Preview on Edit
  useEffect(() => {
    if (courseDetails.thumbnailUrl && !courseDetails.thumbnailChanged) {
      setThumbnailPreview(courseDetails.thumbnailUrl);
    }
  }, [courseDetails.thumbnailUrl, courseDetails.thumbnailChanged]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
    setThumbnailFile(file);
    dispatch(setCourseDetails({ thumbnailChanged: true }));
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  // 2. Enhanced Validation for Edit/Create
  const validate = () => {
    const result = Step1Schema.safeParse(courseDetails);
    const newErrors = {
      title: "",
      description: "",
      category: "",
      subCategory: "",
      skillLevel: "",
      thumbnail: "",
    };
    let isValid = true;

    // Subcategory logic: If current category has sub-options, one must be picked
    if (subCategories.length > 0 && !courseDetails.subCategory) {
      newErrors.subCategory = "Please select a sub-category";
      isValid = false;
    }

    // Thumbnail logic: Valid if there's a new file OR an existing URL (and not marked for deletion)
    if (!thumbnailFile && !courseDetails.thumbnailUrl) {
      newErrors.thumbnail = "Course cover is required";
      isValid = false;
    }

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      newErrors.title = flat.title?.[0] || "";
      newErrors.description = flat.description?.[0] || "";
      newErrors.category = flat.category?.[0] || "";
      newErrors.skillLevel = flat.skillLevel?.[0] || "";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextClick = async () => {
    if (!validate()) return;

    const formData = new FormData();
    if (courseDetails.title) {
      formData.append("title", courseDetails.title);
    }

    if (courseDetails.description) {
      formData.append("description", courseDetails.description);
    }

    if (courseDetails.category) {
      formData.append("category", courseDetails.category);
    }

    if (courseDetails.subCategory) {
      formData.append("subCategory", courseDetails.subCategory);
    }

    if (courseDetails.skillLevel) {
      formData.append("skillLevel", courseDetails.skillLevel);
    }

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      if (isEdit) {
        await updateCourseDetails.mutateAsync({ courseId: courseDetails.id!, payload: formData });
      } else {
        const { courseId } = await createCourse.mutateAsync(formData);
        dispatch(setCourseDetails({ id: courseId }));
      }
      handleNext();
    } catch (err) {
      console.error("Mutation Error:", err);
    }
  };

  const isSubmitting = createCourse.isPending || updateCourseDetails.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-10 px-4"
    >
      <Card className="overflow-hidden border-0 shadow-2xl dark:bg-gray-950 dark:border dark:border-gray-800">
        <CardHeader className="bg-slate-50/80 dark:bg-gray-900/80 py-8 border-b dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
              <Layers size={20} />
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Step 01 / {isEdit ? "Edit Mode" : "New Course"}
            </span>
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">
            {isEdit ? "Update Course Identity" : "Launch Your Course"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-10">
          {/* Title */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Course Title
            </Label>
            <Input
              value={courseDetails.title}
              onChange={(e) => dispatch(setCourseDetails({ title: e.target.value }))}
              placeholder="e.g. Master React Design Patterns"
              className="h-14 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-lg rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs flex items-center gap-1 font-medium">
                <AlertCircle size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Description
            </Label>
            <Textarea
              value={courseDetails.description}
              onChange={(e) => dispatch(setCourseDetails({ description: e.target.value }))}
              placeholder="Provide a brief summary..."
              className="min-h-[140px] bg-white dark:bg-gray-900 rounded-xl border-slate-200 dark:border-gray-800 text-base"
            />
            {errors.description && (
              <p className="text-red-500 text-xs flex items-center gap-1 font-medium">
                <AlertCircle size={14} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Category
              </Label>
              <Select
                value={courseDetails.category || ""}
                onValueChange={(v) => dispatch(setCourseDetails({ category: v, subCategory: "" }))}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 rounded-xl shadow-sm">
                  <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select"} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-slate-200 dark:border-gray-800 shadow-2xl z-[100]">
                  {categoryData?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="py-2.5 cursor-pointer">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-[10px] font-bold uppercase">{errors.category}</p>
              )}
            </div>

            {/* Sub-Category */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Sub-Category
              </Label>
              <Select
                disabled={!subCategories.length || subLoading}
                value={courseDetails.subCategory || ""}
                onValueChange={(v) => dispatch(setCourseDetails({ subCategory: v }))}
              >
                <SelectTrigger
                  className={`h-12 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 rounded-xl shadow-sm ${!subCategories.length && "opacity-50"}`}
                >
                  <SelectValue
                    placeholder={
                      subLoading
                        ? "Loading..."
                        : subCategories.length
                          ? "Select"
                          : "No Sub-Categories"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-slate-200 dark:border-gray-800 shadow-2xl z-[100]">
                  {subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id} className="py-2.5 cursor-pointer">
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subCategory && (
                <p className="text-red-500 text-[10px] font-bold uppercase">{errors.subCategory}</p>
              )}
            </div>

            {/* Skill Level */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Target Level
              </Label>
              <Select
                value={courseDetails.skillLevel || ""}
                onValueChange={(v) => dispatch(setCourseDetails({ skillLevel: v }))}
              >
                <SelectTrigger className="h-12 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 rounded-xl shadow-sm">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-950 border-slate-200 dark:border-gray-800 shadow-2xl z-[100]">
                  {skillLevels.map((lvl) => (
                    <SelectItem key={lvl.value} value={lvl.value} className="py-2.5 cursor-pointer">
                      {lvl.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.skillLevel && (
                <p className="text-red-500 text-[10px] font-bold uppercase">{errors.skillLevel}</p>
              )}
            </div>
          </div>

          {/* Thumbnail Preview Area */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Course Cover Image
            </Label>
            <AnimatePresence mode="wait">
              {!thumbnailPreview ? (
                <motion.label
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-2xl bg-slate-50/50 dark:bg-gray-900/30 cursor-pointer hover:border-indigo-400 hover:bg-white transition-all overflow-hidden"
                >
                  <Upload className="w-10 h-10 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Upload thumbnail
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </motion.label>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative h-72 rounded-2xl overflow-hidden shadow-lg group"
                >
                  <img
                    src={thumbnailPreview}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setThumbnailPreview("");
                        setThumbnailFile(null);
                        dispatch(setCourseDetails({ thumbnailUrl: "" }));
                      }}
                      className="rounded-full px-6 font-bold"
                    >
                      <X size={16} className="mr-2" /> Change Cover
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {errors.thumbnail && (
              <p className="text-red-500 text-xs font-medium italic mt-2">{errors.thumbnail}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-10 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400 hidden sm:block">
          Step 1 of 3 • <span className="text-indigo-500 font-bold">Foundation</span>
        </p>
        <Button
          onClick={handleNextClick}
          disabled={isSubmitting}
          className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2" />
          ) : isEdit ? (
            "Update & Continue"
          ) : (
            "Save & Continue"
          )}
          {!isSubmitting && <ChevronRight size={20} className="ml-2" />}
        </Button>
      </div>
    </motion.div>
  );
};

export default CourseDetails;
