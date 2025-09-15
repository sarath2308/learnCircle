import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import {toast} from 'react-toastify'

export const useOtpResend = () => {
  const navigate = useNavigate();

  const resendOtp = async (role: string | null, data: { email: string|null;type: string|null}) => {
    try {
    
      const response = await api.post(`/auth/${role}/resend-otp`, data);
         return response;
    } catch (error: any) {
      // Handle errors
      console.error("OTP verification failed", error);
      toast.error(error?.response?.data?.message || "OTP verification failed");
      throw error
    }
  };

  return { resendOtp };
};
