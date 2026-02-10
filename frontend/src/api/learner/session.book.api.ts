import api from "../api";

export const SESSION_API = {
    BOOK_SESSION: (payload:{startTime: string, endTime: string, instructorId: string, date: string, price: number, typeOfSession: string}) => api.post("/session-booking/create",  payload ).then((res)=> res.data),
}