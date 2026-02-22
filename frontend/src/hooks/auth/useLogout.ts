import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logOut,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    },
  });
};
