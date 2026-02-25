import api from "../api";

export const PAYMENT_API = {
  GET_PAYMENT_STATUS: (orderId: string) =>
    api.post(`/payment/${orderId}/status`).then((res) => res.data),
};
