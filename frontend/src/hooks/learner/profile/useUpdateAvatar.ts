import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";

export const useUpdateAvatar = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);
  return useMutation({
    mutationFn: profileApi.updateAvatar,
    onSuccess: (res) => {
      console.log(res);
      toast.success("Profile picture updated");
      if (currentUser) {
        const updatedUser = { ...currentUser, profileImg: res.profileImg };
        dispatch(setCurrentUser(updatedUser));
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed update profile");
    },
  });
};
