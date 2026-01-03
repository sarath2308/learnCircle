import api from "../api";


export const adminCourseManagement = {
    getAllCourse:()=>api.get("admin/course").then((res)=> res.data),
}