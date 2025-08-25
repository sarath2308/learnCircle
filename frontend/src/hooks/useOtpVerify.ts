import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import {toast} from 'react-toastify'

export const useOtpVerify = () => {
  const navigate = useNavigate();

  const verifyOtp = async (role: string | null, data: { email: string|null; otp: string ,type: string|null}) => {
    try {
    
      const response = await api.post(`/auth/${role}/verify-otp`, data,{withCredentials:true});

      
      if (role === "learner") navigate("/learner/home");
      else if (role === "professional") navigate("/professionals/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");

    } catch (error: any) {
      // Handle errors
      console.error("OTP verification failed", error);
      toast.error(error?.response?.data?.message || "OTP verification failed");
      throw error;
    }
  };

  return { verifyOtp };
};
