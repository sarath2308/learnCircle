import { useGetCreatorCourses } from "@/hooks/shared/course-creator/creator.courses.get";
import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import CourseCard from "./CourseCard";

export default function MyCourse() {
  const [value, setValue] = useState(0);
  const { data: courses, isLoading } = useGetCreatorCourses();

  if(isLoading){
    return <div>Loading...</div>
  }

  const courseData = courses?.courseData;
 console.log("Courses Data:", courseData);
  return (
    <div>
        <div className="mt-6">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">My Courses</h1>
        </div>
    <Box>
      <Tabs value={value} onChange={(_, v) => setValue(v)}>
        <Tab label="All" />
        <Tab label="Published" />
        <Tab label="Draft" />
      </Tabs>

     
       {value === 0 && (
  <Box p={2}>
    {courseData && courseData.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseData.map((course: any) => (
          <CourseCard
            key={course.id}
            course={course}
            variant="admin"
          />
        ))}
      </div>
    ) : (
      <p>No courses found</p>
    )}
  </Box>
)}


      {value === 1 && <Box p={2}>Curriculum</Box>}
      {value === 2 && <Box p={2}>Reviews</Box>}
    </Box>
    </div>
  );
}
