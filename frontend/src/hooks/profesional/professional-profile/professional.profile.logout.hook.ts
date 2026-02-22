import { PROFESSIONA_PROFILE_API } from "@/api/profesional/professional.profile.api";
import { clearCurrentUser } from "@/redux/slice/currentUserSlice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useProfessionalLogout = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: PROFESSIONA_PROFILE_API.LOGOUT,
    onSuccess: () => {
      dispatch(clearCurrentUser());
    },
  });
};
