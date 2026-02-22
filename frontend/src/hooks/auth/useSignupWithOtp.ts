import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";
export const useSignupWithOtp = () => {
  const dispatch = useDispatch();
  const signupWithOtp = useMutation({
    mutationFn: authApi.signupWithOtp,
    onSuccess: (res) => {
      dispatch(setCurrentUser(res.user));
      toast.success(res.message || "Signup Successful");
    },
    onError: (err: any) => {
      // Axios stores the server response in err.response
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
  return signupWithOtp;
};
