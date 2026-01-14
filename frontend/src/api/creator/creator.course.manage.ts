import api from "../api";

export const creatorCourseManageApi = {
    getCourseDetails:(courseId: string) => api.get(`/creator/course/${courseId}`).then((res) => res.data),
    getChapters:(courseId: string) => api.get(),
    editCourseDetails:(couseId:string,payload: FormData) => api.patch(),
    editPriceDetails: (courseId: string, payload:{price: number, discount: string, type: string})=> api.patch()
}