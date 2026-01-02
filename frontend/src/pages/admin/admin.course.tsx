import CreateCourseStepper from "@/components/createCourse/create.course.stepper";
import { PaginatedTable } from "@/components/PaginatedTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { data } from "react-router-dom";
// import CourseTable from "@/components/course/course.table"; // add later

const AdminCourse = () => {
  const [showCreateCourse, setShowCreateCourse] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        {!showCreateCourse && (
          <Button className="bg-black text-white" onClick={() => setShowCreateCourse(true)}>
            + Create Course
          </Button>
        )}

        {showCreateCourse && (
          <Button
            variant="outline"
            className="bg-black text-white"
            onClick={() => setShowCreateCourse(false)}
          >
            ← Back to Courses
          </Button>
        )}
      </div>

      {/* Content */}
      {!showCreateCourse && (
        <div>
          <PaginatedTable headers={["No", "Course Name", "Created At", "Actions"]} data={[]} />
        </div>
      )}

      {showCreateCourse && <CreateCourseStepper />}
    </div>
  );
};

export default AdminCourse;
