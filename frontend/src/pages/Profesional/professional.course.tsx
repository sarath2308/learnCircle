import MyCourse from "@/components/shared/MyCourse";
import { usePublishCourse } from "@/hooks/shared/course-creator/course.publish.hook";
import { useNavigate } from "react-router-dom";

export default function ProfessionalCourseManage()
{
    const navigate = useNavigate();
    const publishCourse = usePublishCourse();

    const handleEdit = (id: string)=>
    {

    }

    const handleView = (id:string)=>{
      navigate(`/professional/my-courses/${id}`)
    }

     const handlePublish = async(id: string)=>
    {
           await publishCourse.mutateAsync(id);
    }
     const handleCreate = () =>
    {
         navigate("/professional/create-course")
    }
    return(
        <>
        <MyCourse onEdit={handleEdit} onPublish={handlePublish} onView={handleView} onCreate={handleCreate} />
        </>
    )
}