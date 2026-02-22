import { profileApi } from "@/api/learner/profileApi";
import { clearCurrentUser } from "@/redux/slice/currentUserSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useLearnerLogout = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: profileApi.logout,
    onSuccess: () => {
      dispatch(clearCurrentUser());
    },
  });
};
