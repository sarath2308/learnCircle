import { profileApi } from "@/api/learner/profileApi";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";
import type { RootState } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

type UserResponse = {
  userData: {
    name: string;
    email: string;
  };
  message: string;
  success: boolean;
};
export const useVerifyAndUpdateEmail = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((res: RootState) => res.currentUser);
  const getOtp = useMutation({
    mutationFn: profileApi.verifyAndChangeEmail,
    mutationKey: ["RequestEmailChangeOtp"],
    onSuccess: (res: UserResponse) => {
      toast.success(res.message ?? "Profile Updated");
      let updateData = { ...currentUser, email: res.userData.email };
      dispatch(setCurrentUser(updateData));
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("Failed to send otp");
      }
    },
  });
  return getOtp;
};
