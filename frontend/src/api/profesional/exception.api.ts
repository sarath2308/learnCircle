import api from "../api";

export const EXCEPTION_API = {
    createException:(date: string) => api.post("/availability/exception",{date}).then((res)=>res.data),
    removeException:(exceptionId: string) => api.delete(`/availability/exception/${exceptionId}`).then((res)=> res.data),
    listException:() => api.get("/availability/exception").then((res)=>res.data)
}