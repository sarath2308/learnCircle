import api from "../api";

export const CHAT_API = {
    getOrCreateConversation:(courseId: string) => api.get(`/chat/conversation/${courseId}`).then((res)=> res.data),
    getMessages:(conversationId: string) => api.get(`/chat/conversation/messages/${conversationId}`).then((res)=> res.data),
    getAllConversation:() => api.get("/chat/conversation").then((res)=>res.data),
}