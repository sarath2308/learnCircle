import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { AlertCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Button } from "../ui/button";
import type  { Step1Errors } from "@/types/shared/course.step1.error.type";
import { Step1Schema } from "@/schema/shared/create.course.step1.schema";
interface CourseDetailsProps
{
  handleNext:()=> void;
}

const CourseDetails = ({handleNext}: CourseDetailsProps) => {
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [courseDetails, setCourseDetails] = useState({
      title:'',
      description: '',
      category: '',
      skillLevel: '',
      thumbnail: ''
  })
  const [errors,setErrors]=useState<Step1Errors>(
    {
      title:'',
      description: '',
      category: '',
      skillLevel: '',
      thumbnail: ''
    }
  )
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  setThumbnailPreview(url);

 setThumbnailFile(file);
};

const validation = ()=>
{
  let result = Step1Schema.safeParse(courseDetails)
  if (!result.success) {
    const flat = result.error.flatten().fieldErrors;

    setErrors({
      title: flat.title?.[0] || "",
      description: flat.description?.[0] || "",
      category: flat.category?.[0] || "",
      skillLevel: flat.skillLevel?.[0] || "",
      thumbnail: '',
    });

    if(!thumbnailFile)
    {
      setErrors((prev)=>({...prev,thumbnail: "thumbnail required"}))
    }

    return false;
  }

  setErrors({
    title: "",
    description: "",
     category: "",
      skillLevel:  "",
      thumbnail: '',
  });

  return true; 
  }

  const handleNextvalidation=()=>
    {
       if(validation())
       {
        handleNext()
       }
    }

    useEffect(()=>
    {
      let courseId = sessionStorage.getItem("courseId");
      if(courseId)
      {
        
      }
    })
  return (
    <div>
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
              onChange={(e) =>
                setCourseDetails((prev)=>({...prev,title: e.target.value}))
              }
              className={errors.title?.[0] ? "border-red-500" : ""}
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
              onChange={(e) => setCourseDetails((prev)=>({...prev,description: e.target.value}))}
              className={errors.description?.[0]  ? "border-red-500" : ""}
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
              <Select onValueChange={(v) =>  setCourseDetails((prev)=>({...prev,category: v}))}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Web Development",
                    "Data Science",
                    "Machine Learning",
                    "Cloud Computing",
                    "UI/UX Design",
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
              <Label>Skill Level</Label>
              <Select onValueChange={(v) =>  setCourseDetails((prev)=>({...prev,skillLevel: v}))}>
                <SelectTrigger className={errors.skillLevel?.[0]  ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
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

          {/* Thumbnail */}
         <div>
            <Label>Thumbnail (Required)</Label>
            <div className="border border-dashed p-6 rounded-lg text-center">
              {thumbnailPreview ? (
                <div className="relative w-full max-w-md mx-auto">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full rounded-md object-cover"
                  />
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
       <div className="mt-8 flex justify-end">
   <Button className="bg-green-500" onClick={handleNextvalidation}>Next</Button>
      </div>
    </div>
    
  );
}

export default CourseDetails;
