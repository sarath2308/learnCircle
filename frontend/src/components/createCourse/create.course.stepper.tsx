"use client";
import { useMemo, useState } from "react";
import { ProgressBar } from "../ProgressBar";
import Step2Resources from "./course.step2.resource";
import CourseDetails from "./course.details";

export default function CreateCourseStepper() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    setCurrentStep((s) => (s - 1 === 0 ? 1 : s - 1));
  };

  const percent = useMemo(() => {
    return Math.ceil((currentStep / 3) * 100);
  }, [currentStep]);

  return (
    <>
      <div>
        <div>
          <ProgressBar value={percent} label={`${percent}% Completed`} />
        </div>
        <div className="mt-4">
          {currentStep === 1 && <CourseDetails handleNext={handleNext} />}

          {currentStep === 2 && <Step2Resources handleNext={handleNext} handlePrev={handlePrev} />}
        </div>
      </div>
    </>
  );
}
