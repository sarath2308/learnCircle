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
  Plus,
  FileVideo,
  File,
  FileText,
  Sun,
  Moon,
  Upload,
  Edit,
  Trash,
  AlertCircle,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CreateCourseStepper() {
  // ========== COURSE STATE ==========
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    category: "",
    skillLevel: "",
    thumbnail: null as string | null,
  });

  const [resources, setResources] = useState<
    { title: string; type: string; link?: string; file?: File | null; thumbnail?: string | null }[]
  >([]);
  const [pricing, setPricing] = useState({ type: "", price: "", discount: "" });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // ========== VALIDATION ERRORS ==========
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ========== IMAGE HANDLER ==========
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        setCourseDetails({ ...courseDetails, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // ========== RESOURCE MANAGEMENT ==========
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({
    title: "",
    link: "",
    file: null as File | null,
    thumbnail: null as string | null,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openModal) {
      if (editIndex !== null) {
        const res = resources[editIndex];
        setSelectedType(res.type);
        setNewResource({
          title: res.title,
          link: res.link || "",
          file: res.file || null,
          thumbnail: res.thumbnail || null,
        });
      } else {
        setSelectedType(null);
        setNewResource({ title: "", link: "", file: null, thumbnail: null });
      }
    }
  }, [openModal, editIndex, resources]);

  const isUploadType = (type: string | null) => ["Video", "PDF", "Document"].includes(type || "");
  const isLinkType = (type: string | null) => ["YouTube", "Blog", "Article"].includes(type || "");

  const handleResourceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setNewResource({ ...newResource, thumbnail: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const addResource = () => {
    const newErrors: Record<string, string> = {};

    if (!newResource.title.trim()) {
      newErrors["resourceTitle"] = "Resource title is required";
    }

    if (!selectedType) {
      newErrors["resourceType"] = "Please select a resource type";
    } else {
      if (isLinkType(selectedType) && !newResource.link.trim()) {
        newErrors["resourceLink"] = "Resource link is required for this type";
      }
      if (isUploadType(selectedType) && !newResource.file) {
        newErrors["resourceFile"] = "Please upload a file for this type";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const resource = {
      title: newResource.title,
      type: selectedType || "Custom",
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

    setNewResource({ title: "", link: "", file: null, thumbnail: null });
    setSelectedType(null);
    setEditIndex(null);
    setOpenModal(false);
  };

  const deleteResource = (idx: number) => {
    setResources(resources.filter((_, i) => i !== idx));
  };

  const getResourceIcon = (type: string) => {
    if (type === "Video" || type === "YouTube")
      return <FileVideo className="w-5 h-5 text-blue-500" />;
    if (type === "Article" || type === "Blog")
      return <FileText className="w-5 h-5 text-yellow-500" />;
    if (type === "PDF" || type === "Document") return <File className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const resourceStats = resources.reduce(
    (acc, r) => {
      if (r.type) acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const validateStep = (step: number, onError: (msg: string) => void) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!courseDetails.title.trim()) newErrors["title"] = "Course title is required";
      if (!courseDetails.description.trim()) newErrors["description"] = "Description is required";
      if (!courseDetails.category) newErrors["category"] = "Please select a category";
      if (!courseDetails.skillLevel) newErrors["skillLevel"] = "Please select a skill level";
    }

    if (step === 2) {
      if (resources.length === 0) {
        onError("You must add at least one resource.");
        return false;
      }
      const invalid = resources.some((r, idx) => {
        if (!r.title.trim()) newErrors[`resource_${idx}_title`] = "Resource title is required";
        if (!r.type) newErrors[`resource_${idx}_type`] = "Resource type is required";
        if (isLinkType(r.type) && !r.link?.trim())
          newErrors[`resource_${idx}_link`] = "Link is required";
        if (isUploadType(r.type) && !r.file) newErrors[`resource_${idx}_file`] = "File is required";
        return Object.keys(newErrors).length > 0;
      });
      if (invalid) {
        setErrors(newErrors);
        onError("Please fix the highlighted errors in resources.");
        return false;
      }
    }

    if (step === 3) {
      if (!pricing.type) {
        newErrors["pricingType"] = "Please select course type";
      } else if (pricing.type === "Paid" && (!pricing.price || Number(pricing.price) <= 0)) {
        newErrors["price"] = "Price must be greater than 0";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      onError("Please fix the highlighted errors before continuing.");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    console.log("Simulating API call...");
    setTimeout(() => {
      const data = {
        courseDetails,
        resources: resources.map((r) => ({
          ...r,
          file: r.file?.name,
        })),
        pricing,
      };
      console.log("Data sent to API:", data);
      alert("Course created successfully!");
    }, 2000);
  };

  return (
    <TooltipProvider>
      <div className="relative">
        {/* THEME TOGGLE */}

        <Stepper
          initialStep={1}
          validateStep={(step, onError) => validateStep(step, onError)}
          onFinalStepCompleted={handleSubmit}
        >
          {/* STEP 1: COURSE DETAILS */}
          <Step>
            <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="p-1">Course Title</Label>
                  <Input
                    value={courseDetails.title}
                    onChange={(e) => setCourseDetails({ ...courseDetails, title: e.target.value })}
                    placeholder="e.g. Mastering React with TypeScript"
                    className={`dark:bg-gray-800 dark:border-gray-700 ${errors.title ? "border-red-500" : ""}`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="p-1">Description</Label>
                  <Textarea
                    value={courseDetails.description}
                    onChange={(e) =>
                      setCourseDetails({
                        ...courseDetails,
                        description: e.target.value,
                      })
                    }
                    placeholder="Write a short description..."
                    className={`dark:bg-gray-800 dark:border-gray-700 ${errors.description ? "border-red-500" : ""}`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="p-1">Category</Label>
                    <Select
                      onValueChange={(v) => setCourseDetails({ ...courseDetails, category: v })}
                    >
                      <SelectTrigger
                        className={`dark:bg-gray-800
                          dark:border-gray-700 ${errors.category ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800  bg-gray-400 dark:text-gray-100">
                        {[
                          "Web Development",
                          "Data Science",
                          "Machine Learning",
                          "Cybersecurity",
                          "Cloud Computing",
                          "UI/UX Design",
                          "Mobile Development",
                        ].map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
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
                    <Label className="p-1">Skill Level</Label>
                    <Select
                      onValueChange={(v) => setCourseDetails({ ...courseDetails, skillLevel: v })}
                    >
                      <SelectTrigger
                        className={`dark:bg-gray-800 dark:border-gray-700 ${errors.skillLevel ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800  bg-gray-400 dark:text-gray-100">
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
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

                {/* Thumbnail Upload */}
                <div>
                  <Label className="p-1">Thumbnail / Cover Image</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 text-center rounded-lg transition-all hover:border-blue-400 dark:hover:border-blue-500">
                    {thumbnailPreview ? (
                      <div className="relative w-full max-w-md mx-auto">
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-full h-auto rounded-lg object-contain shadow-md"
                        />
                        <button
                          onClick={() => {
                            setThumbnailPreview(null);
                            setCourseDetails({ ...courseDetails, thumbnail: null });
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-3 dark:text-gray-400">
                          Drag and drop or click to upload
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          id="thumbnail"
                          className="hidden"
                        />
                        <Label
                          htmlFor="thumbnail"
                          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                        >
                          Upload
                        </Label>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Step>

          {/* STEP 2: RESOURCES */}
          <Step>
            <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Add Resources</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  What’s Included:{" "}
                  {resources.length > 0
                    ? Object.entries(resourceStats)
                        .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
                        .join(", ")
                    : "No resources added yet."}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Existing Resource List */}
                {resources.map((res, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between bg-gray-50 dark:bg-gray-800 border ${errors[`resource_${idx}_title`] || errors[`resource_${idx}_type`] || errors[`resource_${idx}_link`] || errors[`resource_${idx}_file`] ? "border-red-500" : "border-gray-200 dark:border-gray-700"} rounded-lg px-4 py-3`}
                  >
                    <div className="flex items-center gap-3">
                      {res.thumbnail ? (
                        <img
                          src={res.thumbnail}
                          alt="Thumbnail"
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        getResourceIcon(res.type)
                      )}
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          Lesson {idx + 1}: {res.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{res.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditIndex(idx);
                              setOpenModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit resource</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" onClick={() => deleteResource(idx)}>
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete resource</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}

                {/* Add Resource Button */}
                <div className="flex justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setOpenModal(true)}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Resource
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a new lesson or resource</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Modal */}
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                  <DialogContent className="dark:bg-gray-900 dark:text-gray-100">
                    <DialogHeader>
                      <DialogTitle>
                        {editIndex !== null ? "Edit Resource" : "Add a New Resource"}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Input
                          placeholder="Resource Title"
                          value={newResource.title}
                          onChange={(e) =>
                            setNewResource({ ...newResource, title: e.target.value })
                          }
                          className={`dark:bg-gray-800 dark:border-gray-700 ${errors.resourceTitle ? "border-red-500" : ""}`}
                        />
                        {errors.resourceTitle && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.resourceTitle}
                          </p>
                        )}
                      </div>

                      <div>
                        <Select onValueChange={setSelectedType} value={selectedType || ""}>
                          <SelectTrigger
                            className={`dark:bg-gray-800 dark:border-gray-700 ${errors.resourceType ? "border-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Select Resource Type" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
                            {["Video", "PDF", "Document", "YouTube", "Blog", "Article"].map(
                              (type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        {errors.resourceType && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {errors.resourceType}
                          </p>
                        )}
                      </div>

                      {/* Conditional Fields */}
                      {isUploadType(selectedType) && (
                        <div>
                          <Label>Upload File</Label>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              setNewResource({
                                ...newResource,
                                file: e.target.files?.[0] || null,
                              })
                            }
                          />
                          <label
                            htmlFor="file-upload"
                            className={`flex items-center justify-center w-full gap-2 p-3 rounded-lg border border-dashed ${errors.resourceFile ? "border-red-500" : "border-gray-400 dark:border-gray-600"} text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer transition`}
                          >
                            <Upload className="h-5 w-5" />
                            {newResource.file
                              ? newResource.file.name
                              : "Click to upload or drag file here"}
                          </label>
                          {errors.resourceFile && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> {errors.resourceFile}
                            </p>
                          )}
                        </div>
                      )}

                      {isLinkType(selectedType) && (
                        <div>
                          <Label>Resource Link</Label>
                          <Input
                            type="url"
                            placeholder="Paste link here"
                            value={newResource.link}
                            onChange={(e) =>
                              setNewResource({ ...newResource, link: e.target.value })
                            }
                            className={`dark:bg-gray-800 dark:border-gray-700 ${errors.resourceLink ? "border-red-500" : ""}`}
                          />
                          {errors.resourceLink && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" /> {errors.resourceLink}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Optional Thumbnail Upload */}
                      <div>
                        <Label>Optional Thumbnail</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 text-center rounded-lg transition-all hover:border-blue-400 dark:hover:border-blue-500">
                          {newResource.thumbnail ? (
                            <div className="relative w-full max-w-md mx-auto">
                              <img
                                src={newResource.thumbnail}
                                alt="Preview"
                                className="w-full h-auto rounded-lg object-contain shadow-md"
                              />
                              <button
                                onClick={() => setNewResource({ ...newResource, thumbnail: null })}
                                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="text-gray-500 mb-3 dark:text-gray-400">
                                Drag and drop or click to upload (optional)
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleResourceImageUpload}
                                id="resource-thumbnail"
                                className="hidden"
                              />
                              <Label
                                htmlFor="resource-thumbnail"
                                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                              >
                                Upload
                              </Label>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button onClick={addResource}>Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </Step>

          {/* STEP 3: PRICING */}
          <Step>
            <Card className="shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <Progress value={100} className="mt-2 dark:bg-gray-700 bg-gray-200" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Label>Course Type:</Label>
                  <Select
                    onValueChange={(v) =>
                      setPricing({
                        ...pricing,
                        type: v,
                        price: v === "Free" ? "0" : pricing.price,
                      })
                    }
                  >
                    <SelectTrigger
                      className={`dark:bg-gray-800 dark:border-gray-700 w-[180px] ${errors.pricingType ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:text-gray-100">
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.pricingType && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.pricingType}
                    </p>
                  )}
                </div>

                {pricing.type === "Paid" && (
                  <>
                    <div>
                      <Label>Course Price ($)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 99"
                        value={pricing.price}
                        onChange={(e) => setPricing({ ...pricing, price: e.target.value })}
                        className={`dark:bg-gray-800 dark:border-gray-700 ${errors.price ? "border-red-500" : ""}`}
                        min="1"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> {errors.price}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Discount (%)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 20"
                        value={pricing.discount}
                        onChange={(e) => setPricing({ ...pricing, discount: e.target.value })}
                        className="dark:bg-gray-800 dark:border-gray-700"
                        min="0"
                        max="100"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Final Price:{" "}
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      $
                      {pricing.type === "Free"
                        ? 0
                        : pricing.discount
                          ? (
                              Number(pricing.price || 0) *
                              (1 - Number(pricing.discount) / 100)
                            ).toFixed(2)
                          : pricing.price || 0}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </Step>
        </Stepper>
      </div>
    </TooltipProvider>
  );
}
