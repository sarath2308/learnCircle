import CreateCourseStepper from "@/components/createCourse/create.course.stepper";
import {
  useGetCoureDetails,
  type ICourseDetailsResponse,
} from "@/hooks/shared/course/couse.details.get";
import { setCourseDetails } from "@/redux/slice/course/courseDetails";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export default function EditCourse() {
  const { id } = useParams();
  const dispatch = useDispatch();
  if (!id) {
    return <div>No Data</div>;
  }
  const { data: course, isLoading, error } = useGetCoureDetails(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !course) {
    return <div>Error loading course details</div>;
  }

  const courseDetails = course.courseData;

  dispatch(setCourseDetails(courseDetails));

  return (
    <>
      <CreateCourseStepper />
    </>
  );
}
