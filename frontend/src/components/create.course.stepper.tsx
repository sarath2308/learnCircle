"use client";

import React, { useEffect, useState } from "react";
import Stepper, { Step } from "./Stepper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertCircle,
  FileVideo,
  FileText,
  File,
  Upload,
  Edit,
  Trash,
  Plus,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateCourse } from "@/hooks/shared/useCreateCourse";

export default function CreateCourseStepper() {
  // ========== COURSE STATE ==========
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    category: "",
    skillLevel: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const createCourseMutation = useCreateCourse();

  const [resources, setResources] = useState<
    {
      title: string;
      type: string;
      link?: string;
      file?: File | null;
      thumbnail?: string | null;
    }[]
  >([]);

  const [pricing, setPricing] = useState({ type: "", price: "", discount: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ========== RESOURCE MODAL STATE ==========
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({
    title: "",
    link: "",
    file: null as File | null,
    thumbnail: null as string | null,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // ========== IMAGE UPLOAD ==========
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleResourceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewResource({ ...newResource, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // ========== HELPER FUNCTIONS ==========
  const isUploadType = (type: string | null) =>
    ["Video", "PDF", "Document"].includes(type || "");

  const isLinkType = (type: string | null) =>
    ["YouTube", "Blog", "Article"].includes(type || "");

  const getResourceIcon = (type: string) => {
    if (type === "Video" || type === "YouTube")
      return <FileVideo className="w-5 h-5 text-blue-500" />;
    if (type === "Article" || type === "Blog")
      return <FileText className="w-5 h-5 text-yellow-500" />;
    if (type === "PDF" || type === "Document")
      return <File className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const resourceStats = resources.reduce((acc, r) => {
    if (r.type) acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ========== RESOURCE CRUD ==========
  const addResource = () => {
    const newErrors: Record<string, string> = {};

    if (!newResource.title.trim()) newErrors.resourceTitle = "Title is required";
    if (!selectedType) newErrors.resourceType = "Please select a type";
    else {
      if (isLinkType(selectedType) && !newResource.link.trim())
        newErrors.resourceLink = "Link is required";
      if (isUploadType(selectedType) && !newResource.file)
        newErrors.resourceFile = "File is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const resource = {
      title: newResource.title,
      type: selectedType!,
      link: newResource.link || undefined,
      file: newResource.file,
      thumbnail: newResource.thumbnail,
    };

    if (editIndex !== null) {
      const updated = [...resources];
      updated[editIndex] = resource;
      setResources(updated);
    } else {
      setResources([...resources, resource]);
    }

    // Reset modal
    setNewResource({ title: "", link: "", file: null, thumbnail: null });
    setSelectedType(null);
    setEditIndex(null);
    setOpenModal(false);
    setErrors({});
  };

  const deleteResource = (idx: number) => {
    setResources(resources.filter((_, i) => i !== idx));
  };

  // Reset modal when opened
  useEffect(() => {
    if (openModal && editIndex === null) {
      setNewResource({ title: "", link: "", file: null, thumbnail: null });
      setSelectedType(null);
    }
  }, [openModal, editIndex]);

  // ========== STEP 1 VALIDATION & API CALL ==========
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!courseDetails.title.trim()) newErrors.title = "Title required";
    if (!courseDetails.description.trim()) newErrors.description = "Description required";
    if (!courseDetails.category) newErrors.category = "Category required";
    if (!courseDetails.skillLevel) newErrors.skillLevel = "Skill level required";
    if (!thumbnailFile) newErrors.thumbnail = "Thumbnail is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = async (currentStep: number, nextStep: number) => {
    if (currentStep === 1 && nextStep === 2) {
      if (!validateStep1()) return false;

      const fd = new FormData();
      fd.append("title", courseDetails.title);
      fd.append("description", courseDetails.description);
      fd.append("category", courseDetails.category);
      fd.append("skillLevel", courseDetails.skillLevel);
      fd.append("thumbnail", thumbnailFile!);

      try {
        await createCourseMutation.mutateAsync(fd);
        setErrors({});
        return true;
      } catch (err) {
        console.error("Course creation failed:", err);
        return false;
      }
    }
    return true;
  };

  return (
    <TooltipProvider>
      <div className="relative">
        <Stepper
          initialStep={1}
          onStepChange={handleStepChange}
          validateStep={() => true}
          onFinalStepCompleted={() => alert("Course created successfully!")}
        >
          {/* STEP 1: Course Details */}
          <Step>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label>Course Title</Label>
                  <Input
                    value={courseDetails.title}
                    onChange={(e) => setCourseDetails({ ...courseDetails, title: e.target.value })}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={courseDetails.description}
                    onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.description}
                    </p>
                  )}
                </div>

                {/* Category & Skill Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Category</Label>
                    <Select onValueChange={(v) => setCourseDetails({ ...courseDetails, category: v })}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Web Development", "Data Science", "Machine Learning", "Cloud Computing", "UI/UX Design"].map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Skill Level</Label>
                    <Select onValueChange={(v) => setCourseDetails({ ...courseDetails, skillLevel: v })}>
                      <SelectTrigger className={errors.skillLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.skillLevel && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.skillLevel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <Label>Thumbnail (Required)</Label>
                  <div className="border border-dashed p-6 rounded-lg text-center">
                    {thumbnailPreview ? (
                      <div className="relative w-full max-w-md mx-auto">
                        <img src={thumbnailPreview} alt="Preview" className="w-full rounded-md object-cover" />
                        <button
                          onClick={() => {
                            setThumbnailPreview(null);
                            setThumbnailFile(null);
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-3">Upload course thumbnail</p>
                        <input
                          type="file"
                          accept="image/*"
                          id="thumbnail"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        <Label
                          htmlFor="thumbnail"
                          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Choose Image
                        </Label>
                      </>
                    )}
                  </div>
                  {errors.thumbnail && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.thumbnail}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Step>

          {/* STEP 2: Resources */}
          <Step>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Add Resources</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {resources.length > 0
                    ? Object.entries(resourceStats)
                        .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
                        .join(", ")
                    : "No resources added yet."}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {resources.map((res, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {res.thumbnail ? (
                        <img src={res.thumbnail} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        getResourceIcon(res.type)
                      )}
                      <div>
                        <p className="font-medium">Lesson {idx + 1}: {res.title}</p>
                        <p className="text-xs text-gray-500">{res.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setEditIndex(idx); setOpenModal(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteResource(idx)}>
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button onClick={() => { setEditIndex(null); setOpenModal(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Resource
                  </Button>
                </div>

                <Dialog open={openModal} onOpenChange={setOpenModal}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editIndex !== null ? "Edit" : "Add"} Resource</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Resource Title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                      <Select value={selectedType || ""} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Video", "PDF", "Document", "YouTube", "Blog", "Article"].map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isLinkType(selectedType) && (
                        <Input
                          type="url"
                          placeholder="Enter link"
                          value={newResource.link}
                          onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                        />
                      )}

                      {isUploadType(selectedType) && (
                        <div>
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={(e) => setNewResource({ ...newResource, file: e.target.files?.[0] || null })}
                          />
                          <Label htmlFor="file-upload" className="cursor-pointer border-2 border-dashed p-4 block text-center">
                            {newResource.file ? newResource.file.name : "Upload file"}
                          </Label>
                        </div>
                      )}

                      <div>
                        <Label>Thumbnail (Optional)</Label>
                        {newResource.thumbnail ? (
                          <div className="relative">
                            <img src={newResource.thumbnail} alt="" className="w-full h-40 object-cover rounded" />
                            <button
                              onClick={() => setNewResource({ ...newResource, thumbnail: null })}
                              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              id="res-thumb"
                              className="hidden"
                              onChange={handleResourceImageUpload}
                            />
                            <Label htmlFor="res-thumb" className="cursor-pointer border p-4 block text-center text-sm">
                              Upload thumbnail
                            </Label>
                          </>
                        )}
                      </div>

                      <Button onClick={addResource} className="w-full">Save Resource</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </Step>

          {/* STEP 3: Pricing */}
          <Step>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Course Type</Label>
                  <Select
                    value={pricing.type}
                    onValueChange={(v) => setPricing({ ...pricing, type: v, price: v === "Free" ? "0" : pricing.price })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Free or Paid?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {pricing.type === "Paid" && (
                  <>
                    <Input
                      type="number"
                      placeholder="Price in USD"
                      value={pricing.price}
                      onChange={(e) => setPricing({ ...pricing, price: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Discount % (optional)"
                      value={pricing.discount}
                      onChange={(e) => setPricing({ ...pricing, discount: e.target.value })}
                      min="0"
                      max="100"
                    />
                  </>
                )}

                <div className="pt-4 text-lg font-semibold">
                  Final Price: $
                  {pricing.type === "Free"
                    ? "0.00"
                    : pricing.discount
                    ? (Number(pricing.price) * (1 - Number(pricing.discount) / 100)).toFixed(2)
                    : pricing.price || "0.00"}
                </div>
              </CardContent>
            </Card>
          </Step>
        </Stepper>
      </div>
    </TooltipProvider>
  );
}