import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";

export const useUpdatProfile = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (res) => {
      toast.success(res?.message || "Profile Updated");

      // Dispatch the full user object to Redux
      if (res?.user) {
        dispatch(setCurrentUser(res.user));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    },
  });
};
