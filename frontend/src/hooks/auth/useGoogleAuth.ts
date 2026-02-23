import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
export const useGoogle = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: authApi.googleAuth,
    onSuccess: (res) => {
      dispatch(setCurrentUser(res.user));
      toast.success("Sign successfull");
    },
    onError: (err: unknown) => {
      // Axios stores the server response in err.response
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};
