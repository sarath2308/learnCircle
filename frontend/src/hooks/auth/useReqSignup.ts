import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";

export const useReqSignup = () => {
  const reqSignup = useMutation({
    mutationFn: authApi.reqSignup,
    onSuccess: (res) => {
      toast.success(res.message || "otp has been sent to your mail");
    },
    onError: (err: any) => {
      // Axios stores the server response in err.response
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
  return reqSignup;
};
