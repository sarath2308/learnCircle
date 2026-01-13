import MyCourse from "@/components/shared/MyCourse";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminMyCoursePage(){
    const navigate = useNavigate();
    return <div>
        <div className="flex justify-end mt-4">
            <Button className="btn bg-green-500 text-white" onClick={() => navigate("/admin/create-course")}>+ Create Course</Button>
        </div>      
        <MyCourse />
    </div>
}