import api from "../api";

export const learnerHomeApi =
{
    getHome:()=>api.get("/learner/home").then(res=>res.data),
};