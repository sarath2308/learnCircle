import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { AxiosError } from "axios";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";
import { useDispatch } from "react-redux";
export const useLogin = () => {
  const dispatch = useDispatch();
  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      toast.success(res.message || "Login Success");
      dispatch(setCurrentUser(res.user));
      console.log("login success");
      console.log(res.user);
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
