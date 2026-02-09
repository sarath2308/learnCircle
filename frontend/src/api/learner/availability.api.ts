import api from "../api";

export const LEARNER_AVAILABILITY_API = {
  GET_AVAILABILITY: (instructorId: string, date: string) => api.get(`/learner/availability?instructorId=${instructorId}&date=${date}`).then((res)=>res.data)
};