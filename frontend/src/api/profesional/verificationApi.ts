import api from "../api";

export const verificationApi = {
  verification: (payload: any) => api.post("/professional/profile", payload).then((res) => res.data),
};
