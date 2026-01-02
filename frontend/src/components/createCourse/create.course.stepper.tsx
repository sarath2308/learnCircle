"use client";
import { useState } from "react";
import Step2Resources from "./course.step2.resource";
import CourseDetails from "./course.details";
import CoursePricingForm from "./course.step3";

export default function CreateCourseStepper() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    setCurrentStep((s) => (s - 1 === 0 ? 1 : s - 1));
  };

  return (
    <>
      <div>
        <div className="mt-4">
          {currentStep === 1 && <CourseDetails handleNext={handleNext} />}

          {currentStep === 2 && <Step2Resources handleNext={handleNext} handlePrev={handlePrev} />}

          {currentStep === 3 && <CoursePricingForm />}
        </div>
      </div>
    </>
  );
}
