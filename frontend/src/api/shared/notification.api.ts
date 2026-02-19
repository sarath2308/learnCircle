import api from "../api";

export const NOTIFICATION_API = {
    GET_NOTIFICATION:() => api.get("/notification").then((res)=>res.data),
    MARK_AS_READ:() => api.post("/notification").then((res)=>res.data),
};