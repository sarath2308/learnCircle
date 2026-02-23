import MyCourse from "@/components/shared/MyCourse";
import { usePublishCourse } from "@/hooks/shared/course-creator/course.publish.hook";
import { useNavigate } from "react-router-dom";

export default function AdminMyCoursePage() {
  const navigate = useNavigate();
  const publishCourse = usePublishCourse();

  const handleViewCourse = (id: string) => {
    navigate(`/admin/my-courses/${id}`);
  };
  const handlePublish = async (id: string) => {
    await publishCourse.mutateAsync(id);
  };
  const handleCreate = () => {
    navigate("/admin/create-course");
  };
  return (
    <div>
      <div className="flex justify-end mt-4"></div>
      <MyCourse onPublish={handlePublish} onView={handleViewCourse} onCreate={handleCreate} />
    </div>
  );
}
