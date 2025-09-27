import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slice/tempSlice";

export const useOtpVerify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyOtp = async (
    role: string | null,
    data: { email: string | null; otp: string; type: string | null },
  ) => {
    try {
      const response = await api.post(
        `/auth/${role}/verify-otp`,
        { ...data, role },
        {
          withCredentials: true,
        },
      );

      console.log("[useOtpVerify] response:", response.data);
      toast.success("OTP Verified");

      if (data.type === "forgot") {
        if (role === "learner") {
          navigate(`/auth/learner/reset-password?role=${role}&token=${response.data.token}`);
        } else {
          navigate(`/auth/profesional/reset-password?role=${role}&token=${response.data.token}`);
        }
      } else {
        // saving to redux
        if (response.data.user) {
          dispatch(setUser({ ...response.data.user, role }));
        }

        if (role === "learner") {
          navigate("/learner/home");
        } else if (role === "profesional") {
          navigate(`/${role}/home`);
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        }
      }
    } catch (error: any) {
      console.error("[useOtpVerify] error:", error);
      toast.error(error?.response?.data?.message || "OTP verification failed");
    }
  };

  return { verifyOtp };
};
