import MyCourse from "@/components/shared/MyCourse";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminMyCoursePage(){
    const navigate = useNavigate();

    const handleEdit = (id: string)=>
    {

    }
    const handleViewCourse = (id: string) =>
    {
      navigate(`/admin/my-courses/${id}`)
    }
    const handlePublish = (id: string)=>
    {

    }
    const handleCreate = () =>
    {
         navigate("/admin/create-course")
    }
    return <div>
        <div className="flex justify-end mt-4">
        </div>      
        <MyCourse onEdit={handleEdit} onPublish={handlePublish} onView={handleViewCourse} onCreate={handleCreate}/>
    </div>
}