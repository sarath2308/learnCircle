import api from "../api";

export const AVAILABILITY_API = {
  createAvailability: (payload: {
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
    slotDuration: number;
    price: number;
  }) => api.post("/availability", payload).then((res) => res.data),
  removeAvailability: (avlId: string) =>
    api.delete(`/availability/${avlId}`).then((res) => res.data),
  getAllAvailabilityRule: () => api.get("/availability").then((res) => res.data),
};
