import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import {toast} from 'react-toastify'

export const useGetOtp = () => {
  const navigate = useNavigate();

  const getOtp = async (role: string | null, data: { email: string|null ;type: string|null}) => {
    try {
    
      const response = await api.post(`/auth/${role}/get-otp`, data,{withCredentials:true});

      toast.success("Please check your email for the verification code.")
        navigate(`/auth/${role}/verify-otp?role=${role}&type=${data.type}&email=${data.email}`);

    } catch (error: any) {
      console.error("OTP sending failed", error);
      toast.error(error?.response?.data?.message || "OTP sending failed");
      throw error;
    }
  };

  return { getOtp };
};
