import api from "../api";

export const LEARNER_COURSE_API = {
    getLearnerCourse:(courseId: string) => api.get(`/learner/course/${courseId}`).then((res)=>res.data)
}