import api from "../api";

export const creatorApi ={
    getAllCoursesForCreator:(status: string) => api.get(`/creator/course?status=${status?? ''}`).then(res => res.data),
    getCourseById:(id:string) => api.get(`/creator/course/${id}`).then(res => res.data),
}