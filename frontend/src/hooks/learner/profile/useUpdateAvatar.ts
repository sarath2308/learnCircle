import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";
import { AxiosError } from "axios";

export const useUpdateAvatar = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  return useMutation({
    mutationFn: profileApi.updateAvatar,
    onSuccess: (res) => {
      toast.success("Profile picture updated");

      if (currentUser) {
        const updatedUser = { ...currentUser, profileImg: res.profileUrl };
        dispatch(setCurrentUser(updatedUser));
      }

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError)
        toast.error(err?.response?.data?.message || "Failed to update profile");
      else toast.error("Failed to update profile");
    },
  });
};
