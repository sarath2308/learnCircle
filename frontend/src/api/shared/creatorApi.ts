import api from "../api";

export const creatorApi ={
    getAllCoursesForCreator:() => api.get("/creator/course").then(res => res.data),
    getCourseById:(id:string) => api.get(`/creator/course/${id}`).then(res => res.data),
}