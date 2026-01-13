import CreateCourseStepper from "@/components/createCourse/create.course.stepper";
import { Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";

export default function AdminCourseCreatePage() {
  return <div>
    <div>
      <Button className="btn btn-ghost" onClick={() => history.back()}><ArrowLeft />Back</Button>
    </div>
     <div>
      <CreateCourseStepper />
     </div>
    </div>;
}