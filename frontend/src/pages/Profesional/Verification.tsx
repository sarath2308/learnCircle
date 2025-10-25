"use client";

import React, { useState } from "react";
import Stepper, { Step } from "../../components/Stepper";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVerification } from "@/hooks/profesional/useVerification";
import toast from "react-hot-toast";
import { Processing } from "./Processing";
interface ProfileData {
  title: string;
  bio: string;
  companyName: string;
  experience?: number;
  skills: string[];
  typesOfSessions: string[];
  resume?: File;
  image?: File;
}

interface Errors {
  [key: string]: string;
}

const Verification = () => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { mutate, isPending } = useVerification();

  const [data, setData] = useState<ProfileData>({
    title: "",
    bio: "",
    companyName: "",
    experience: undefined,
    skills: [],
    typesOfSessions: [],
    resume: undefined,
    image: undefined,
  });
  const [errors, setErrors] = useState<Errors>({});

  const skills = data.skills;
  const sessions = data.typesOfSessions;

  const toggleArrayValue = (field: "skills" | "typesOfSessions", value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  // Step validation functions
  const validateStep1 = (): boolean => {
    const newErrors: Errors = {};
    if (!data.title) newErrors.title = "Please select a title";
    if (!data.image) newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Errors = {};
    if (!data.bio.trim()) newErrors.bio = "Bio is required";
    else if (data.bio.length < 50) newErrors.bio = "Bio must be at least 50 characters";
    else if (data.bio.length > 500) newErrors.bio = "Bio must be less than 500 characters";
    if (!data.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!data.experience || data.experience < 1)
      newErrors.experience = "Experience should be at least 1 year";
    if (data.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (data.typesOfSessions.length === 0)
      newErrors.typesOfSessions = "At least one session type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Errors = {};
    if (!data.resume) newErrors.resume = "Resume is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return true;
    }
  };

  const { mutateAsync } = useVerification();

  const handleFinalStepComplete = async () => {
    if (!validateStep(step)) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("bio", data.bio);
    formData.append("companyName", data.companyName);
    if (data.experience !== undefined) formData.append("experience", data.experience.toString());
    formData.append("skills", JSON.stringify(data.skills));
    formData.append("typesOfSessions", JSON.stringify(data.typesOfSessions));
    if (data.resume) formData.append("resume", data.resume);
    if (data.image) formData.append("avatar", data.image);

    try {
      const result = await mutateAsync(formData);
      setProcessing(true);
      console.log("Profile submitted successfully:", result);
      toast("Profile submitted successfully!");
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast.error("Failed to submit profile. Please try again.");
    }
  };

  const jobTitles = [
    "Software Engineer",
    "Senior Software Engineer",
    "Tech Lead",
    "Product Manager",
    "Data Scientist",
    "DevOps Engineer",
    "UX Designer",
    "Other",
  ];
  if (processing) return <Processing />;
  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <Stepper
          initialStep={1}
          backButtonText="Previous"
          nextButtonText="Next"
          onStepChange={(nextStep) => setStep(nextStep)}
          onFinalStepCompleted={handleFinalStepComplete}
          validateStep={validateStep}
        >
          {/* STEP 1 */}
          <Step>
            <h2 className="text-2xl font-semibold mb-8">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col items-center">
                <Label className="mb-2 text-gray-700">Profile Image</Label>
                <div className="w-48 h-48 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <label className="mt-4 flex items-center space-x-2 cursor-pointer text-gray-600">
                  <Upload className="w-5 h-5" />
                  <span>Upload Image</span>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        setErrors({ ...errors, image: "Image must be <= 5MB" });
                        e.target.value = "";
                        return;
                      }
                      setData((prev) => ({ ...prev, image: file }));
                      setImagePreview(URL.createObjectURL(file));
                      setErrors((prev) => ({ ...prev, image: "" }));
                    }}
                  />
                </label>
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>

              <div className="md:col-span-2 flex flex-col space-y-6">
                <div className="flex flex-col">
                  <Label htmlFor="title" className="mb-2 text-gray-700">
                    Title
                  </Label>
                  <Select
                    value={data.title}
                    onValueChange={(value) => {
                      setData((prev) => ({ ...prev, title: value }));
                      setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                  >
                    <SelectTrigger className="w-full border-gray-300 rounded-md p-2">
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTitles.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 2 */}
          <Step>
            <h2 className="text-2xl font-semibold mb-8">Profile Details</h2>
            <div className="space-y-6">
              <div className="flex flex-col">
                <Label htmlFor="bio" className="mb-2 text-gray-700">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, bio: e.target.value }));
                    setErrors((prev) => ({ ...prev, bio: "" }));
                  }}
                  placeholder="Tell us about your background and expertise..."
                  rows={4}
                  className="border-gray-300 rounded-md p-2"
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="companyName" className="mb-2 text-gray-700">
                  Company
                </Label>
                <Input
                  id="companyName"
                  value={data.companyName}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, companyName: e.target.value }));
                    setErrors((prev) => ({ ...prev, companyName: "" }));
                  }}
                  placeholder="Company Name"
                  className="border-gray-300 rounded-md p-2"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="experience" className="mb-2 text-gray-700">
                  Experience (Years)
                </Label>
                <Input
                  id="experience"
                  type="number"
                  value={data.experience || ""}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, experience: Number(e.target.value) }));
                    setErrors((prev) => ({ ...prev, experience: "" }));
                  }}
                  className="border-gray-300 rounded-md p-2"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <Label className="mb-2 text-gray-700">Skills</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["React", "Node.js", "AWS", "Docker", "Python"].map((skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        checked={skills.includes(skill)}
                        onCheckedChange={() => {
                          toggleArrayValue("skills", skill);
                          setErrors((prev) => ({ ...prev, skills: "" }));
                        }}
                        className="border-gray-300 rounded"
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
              </div>

              {/* Types of Sessions */}
              <div>
                <Label className="mb-2 text-gray-700">Types of Sessions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["1:1 Mentorship", "Mock Interview", "Resume Review", "Live Workshop"].map(
                    (session) => (
                      <label key={session} className="flex items-center space-x-2">
                        <Checkbox
                          checked={sessions.includes(session)}
                          onCheckedChange={() => {
                            toggleArrayValue("typesOfSessions", session);
                            setErrors((prev) => ({ ...prev, typesOfSessions: "" }));
                          }}
                          className="border-gray-300 rounded"
                        />
                        <span>{session}</span>
                      </label>
                    ),
                  )}
                </div>
                {errors.typesOfSessions && (
                  <p className="text-red-500 text-sm mt-1">{errors.typesOfSessions}</p>
                )}
              </div>
            </div>
          </Step>

          {/* STEP 3 */}
          <Step>
            <h2 className="text-2xl font-semibold mb-8">Professional Verification</h2>
            <div className="flex flex-col">
              <Label htmlFor="resume" className="mb-2 text-gray-700">
                Upload Resume (PDF, DOC, DOCX | max 5MB)
              </Label>
              <label className="flex items-center space-x-2 cursor-pointer p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">
                  {data.resume ? data.resume.name : "Choose file"}
                </span>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) {
                      setErrors({ ...errors, resume: "File size must be <= 5MB" });
                      e.target.value = "";
                      return;
                    }
                    setData((prev) => ({ ...prev, resume: file }));
                    setErrors((prev) => ({ ...prev, resume: "" }));
                  }}
                />
              </label>
              {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
            </div>
          </Step>

          {/* STEP 4 */}
          <Step>
            <h2 className="text-2xl font-semibold mb-8">Review & Submit</h2>
            <p className="text-gray-600 mb-6">
              Please review your information. Once submitted, our team will verify your details and
              notify you by email.
            </p>
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default Verification;
