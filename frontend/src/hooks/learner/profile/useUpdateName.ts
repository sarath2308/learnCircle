import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/api/learner/profileApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "@/redux/slice/currentUserSlice";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type UserResponse = {
  userData: {
    name: string;
  };
  message: string;
  success: boolean;
};
export const useUpdatName = () => {
  let queryClient = useQueryClient();
  let currentUser = useSelector((state: RootState) => state.currentUser);
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: profileApi.updateName,
    onSuccess: (res: UserResponse) => {
      toast.success(res?.message || "Profile Updated");

      // Dispatch the full user object to Redux
      if (res?.userData) {
        let updated = { ...currentUser, name: res.userData.name };
        dispatch(setCurrentUser(updated));
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || "Failed to update profile");
      } else {
        toast.error("Failed to update profile");
      }
    },
  });
};
