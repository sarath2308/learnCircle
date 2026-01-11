import api from "../api";


export const adminCourseManagement = {
    getAllCourse:(page:number,limit:number)=>api.get(`admin/course?page=${page}&limit=${limit}`).then((res)=> res.data),
     getCourse:(courseId:string) => api.get(`/admin/course/${courseId}`).then((res) => res.data),
}