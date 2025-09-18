import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logOut,
    onSuccess: () => {
      // Clear cached user data
      queryClient.clear();

      // Redirect to login
      navigate("/");

      toast.success("Logged out successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Logout failed");
    },
  });
};
