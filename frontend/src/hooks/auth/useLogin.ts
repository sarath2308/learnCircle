import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { AxiosError } from "axios";
export const useLogin = () => {
  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      toast.success(res.message || "Login Success");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Something went Wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  return login;
};
