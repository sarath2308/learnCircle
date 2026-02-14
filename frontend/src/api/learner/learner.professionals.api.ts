import api from "../api";

export const LEARNER_PROFESSIONALS_API = {
  getProfessionals: (search: string, page: number) =>
    api.get(`/learner/professionals?search=${search}&page=${page}`).then((res) => res.data),
  getProfessionalData: (instructorId: string) =>
    api.get(`/learner/professionals/${instructorId}`).then((res) => res.data),
};
