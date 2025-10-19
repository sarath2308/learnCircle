import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";
import { useDispatch } from "react-redux";
export const useGoogle = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: authApi.googleAuth,
    onSuccess: (res) => {
      dispatch(setCurrentUser(res.user));
      toast.success("Sign successfull");
    },
    onError: (err: any) => {
      // Axios stores the server response in err.response
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
};
