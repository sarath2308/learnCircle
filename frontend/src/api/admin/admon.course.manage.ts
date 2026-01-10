import api from "../api";


export const adminCourseManagement = {
    getAllCourse:(page:number,limit:number)=>api.get(`admin/course?page=${page}&limit=${limit}`).then((res)=> res.data),
}