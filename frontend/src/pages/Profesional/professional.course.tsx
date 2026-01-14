import MyCourse from "@/components/shared/MyCourse";
import { useNavigate } from "react-router-dom";

export default function ProfessionalCourseManage()
{
    const navigate = useNavigate();

    const handleEdit = (id: string)=>
    {

    }

    const handleView = (id:string)=>{
      navigate(`/professional/my-courses/${id}`)
    }

    const handlePublish=(id:string)=>
    {

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