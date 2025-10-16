import api from "../api";

export const verificationApi = {
  verification: (payload: any) =>
    api.post("/profesional/verification", payload).then((res) => res.data),
};
