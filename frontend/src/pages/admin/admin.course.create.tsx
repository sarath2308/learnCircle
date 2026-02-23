import CreateCourseStepper from "@/components/createCourse/create.course.stepper";
import { Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCourseCreatePage() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
          Back
        </Button>
      </div>
      <div>
        <CreateCourseStepper />
      </div>
    </div>
  );
}
