import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Upload, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Step1Errors } from "@/types/shared/course.step1.error.type";
import { Step1Schema } from "@/schema/shared/create.course.step1.schema";
import { useGetCategory } from "@/hooks/shared/category.get";
import { useCreateCourse } from "@/hooks/shared/create.course.step1";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCourseDetails } from "@/redux/slice/courseDetails";
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
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { data: categoryData, isLoading: categoriesLoading } = useGetCategory();
  const completeStep1 = useCreateCourse();

  const courseDetails = useSelector((state: RootState) => state.courseDetails);
  const dispatch = useDispatch();

    const {data: subCategoryData, isLoading: subcategoriesLoading} = useGetSubCategories(courseDetails.category);
   const subCategories = subCategoryData?.subCategories ?? [];

  const [errors, setErrors] = useState<Step1Errors>({
    title: "",
    description: "",
    category: "",
    subCategory:"",
    skillLevel: "",
    thumbnail: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate file type/size
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, thumbnail: "Please upload a valid image" }));
      return;
    }

    setThumbnailPreview(URL.createObjectURL(file));
    setThumbnailFile(file);
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  const removeThumbnail = () => {
    setThumbnailPreview("");
    setThumbnailFile(null);
  };

  const validate = () => {
    const result = Step1Schema.safeParse(courseDetails);
    if(subCategories.length > 0 && !courseDetails.subCategory){
      setErrors((prev) => ({ ...prev, subCategory: "Sub Category is required" }));
      return false;
    }
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors({
        title: flat.title?.[0] || "",
        description: flat.description?.[0] || "",
        category: flat.category?.[0] || "",
        skillLevel: flat.skillLevel?.[0] || "",
        thumbnail: thumbnailFile ? "" : "Thumbnail is required",
      });
      return false;
    }
    setErrors({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      skillLevel: "",
      thumbnail: "",
    });
    return true;
  };

  const handleNextClick = async () => {
    if (!validate() || !thumbnailFile) {
      setErrors((prev) => ({ ...prev, thumbnail: "Thumbnail is required" }));
      return;
    }

    const formData = new FormData();
    formData.append("title", courseDetails.title);
    formData.append("description", courseDetails.description);
    formData.append("category", courseDetails.category);
    formData.append("subCategory", courseDetails.subCategory? courseDetails.subCategory : "");
    formData.append("skillLevel", courseDetails.skillLevel);
    formData.append("thumbnail", thumbnailFile);

    try {
      const { courseId } = await completeStep1.mutateAsync(formData);
      dispatch(setCourseDetails({ id: courseId }));
      handleNext();
    } catch (err) {
      console.error("Course creation failed:", err);
      // You should surface this error properly
    }
  };

  const isSubmitting = completeStep1.isPending;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Card className="border-0 shadow-2xl bg-white dark:bg-gray-950 dark:border dark:border-gray-800">
        <CardHeader className="pb-8 border-b dark:border-gray-800">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Create Course - Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10 pt-8">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Course Title
            </Label>
            <Input
              id="title"
              value={courseDetails.title}
              onChange={(e) => dispatch(setCourseDetails({ title: e.target.value }))}
              placeholder="e.g. Mastering TypeScript in 2026"
              className="h-12 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.title && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={courseDetails.description}
              onChange={(e) => dispatch(setCourseDetails({ description: e.target.value }))}
              placeholder="What will students learn? Who is this for? Why take this course?"
              rows={6}
              className="resize-none text-base border-gray-300 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100"
            />
            {errors.description && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {errors.description}
              </p>
            )}
          </div>

          {/* Category & Skill Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Category</Label>
              {categoriesLoading ? (
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              ) : (
                <Select value={courseDetails.category} onValueChange={(v) => dispatch(setCourseDetails({ category: v }))}>
                  <SelectTrigger className="h-12 border-gray-300 dark:border-gray-700 dark:bg-gray-900/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 dark:data-[state=open]:ring-blue-400  dark:text-white">
                    <SelectValue placeholder="Select a category" className="text-gray-600   dark:text-white" />
                  </SelectTrigger>
                  <SelectContent
                    className="min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 shadow-2xl rounded-lg z-50 dark:text-white"
                    position="popper"
                    sideOffset={8}
                  >
                    {categoryData?.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="py-3 px-4 text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.category && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {errors.category}
                </p>
              )}
            </div>

              <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Sub Category</Label>
              {categoriesLoading ? (
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              ) : (
                <Select value={courseDetails.subCategory} onValueChange={(v) => dispatch(setCourseDetails({ subCategory: v }))}>
                  <SelectTrigger className="h-12 border-gray-300 dark:border-gray-700 dark:bg-gray-900/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 dark:data-[state=open]:ring-blue-400  dark:text-white">
                    <SelectValue placeholder="Select a sub category" className="text-gray-600   dark:text-white" />
                  </SelectTrigger>
                  <SelectContent
                    className="min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 shadow-2xl rounded-lg z-50 dark:text-white"
                    position="popper"
                    sideOffset={8}
                  >
                    {subCategories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="py-3 px-4 text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.subCategory && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {errors.subCategory}
                </p>
              )}
            </div>

            {/* Skill Level */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Skill Level</Label>
              <Select value={courseDetails.skillLevel} onValueChange={(v) => dispatch(setCourseDetails({ skillLevel: v }))}>
                <SelectTrigger className="h-12  dark:text-white border-gray-300 dark:border-gray-700 dark:bg-gray-900/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 dark:data-[state=open]:ring-blue-400">
                  <SelectValue placeholder="Select skill level" className="text-gray-600 dark:text-gray-400" />
                </SelectTrigger>
                <SelectContent
                  className="min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 shadow-2xl rounded-lg z-50  dark:text-white"
                  position="popper"
                  sideOffset={8}
                >
                  {skillLevels.map((level) => (
                    <SelectItem
                      key={level.value}
                      value={level.value}
                      className="py-3 px-4 text-base cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 capitalize"
                    >
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.skillLevel && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {errors.skillLevel}
                </p>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Course Thumbnail</Label>
            <div className="max-w-2xl">
              {!thumbnailPreview ? (
                <label
                  htmlFor="thumbnail-upload"
                  className="block w-full h-80 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all"
                >
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, WEBP · Max 10MB
                      </p>
                    </div>
                  </div>
                  <input id="thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative group rounded-xl overflow-hidden shadow-2xl">
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-80 object-cover" />
                  <button
                    onClick={removeThumbnail}
                    className="absolute top-4 right-4 p-3 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              {errors.thumbnail && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5 mt-3">
                  <AlertCircle className="w-4 h-4" /> {errors.thumbnail}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 flex justify-end">
        <Button
          size="lg"
          onClick={handleNextClick}
          disabled={isSubmitting}
          className="h-12 px-10 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg transition-all"
        >
          {isSubmitting ? "Creating Course..." : "Continue to Content"}
        </Button>
      </div>
    </div>
  );
};

export default CourseDetails;