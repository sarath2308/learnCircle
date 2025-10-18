import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
export const useSignupWithOtp = () => {
  const signupWithOtp = useMutation({
    mutationFn: authApi.signupWithOtp,
    onSuccess: (res) => {
      toast.success(res.message || "Signup Successful");
    },
    onError: (err) => {
      toast.error(err.message || "something went wrong");
    },
  });
  return signupWithOtp;
};
