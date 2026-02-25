import { PAYMENT_API } from "@/api/shared/payment.api";
import { useMutation } from "@tanstack/react-query";

export const useGetPaymentStatus = () => {
  return useMutation({
    mutationFn: PAYMENT_API.GET_PAYMENT_STATUS,
  });
};
