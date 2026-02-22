import api from "../api";

export const CHATBOT_API = {
  getMessage: (message: string) => api.post("/chat-bot", { message }).then((res) => res.data),
};
