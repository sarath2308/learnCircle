import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import {toast} from 'react-toastify'

export const useOtpVerify = () => {
  const navigate = useNavigate();

  const verifyOtp = async (role: string | null, data: { email: string|null; otp: string ,type: string|null}) => {
    try {
    
      const response = await api.post(`/auth/${role}/verify-otp`, data,{withCredentials:true});

      console.log(response)
      if (role === "learner"){
            toast.success("OTP Verified")
        if(data.type==='forgot')
        {
          navigate(`/auth/learner/reset-password?role=${role}&token=${response.data.token}`);
        }
        else
        {
        navigate("/learner/home");
        }
      } 
      else if (role === "professional") {
            toast.success("OTP Verified")
         if(data.type==='forgot')
        {
          navigate(`/auth/${role}/setPassword`);
        }
        else
        {
        navigate(`/${role}/dashboard`);
        }
        
      }
      else if (role === "admin")
        { 
             toast.success("OTP Verified")
            navigate("/admin/dashboard");
        }

    } catch (error: any) {
      console.error("OTP verification failed", error);
      toast.error(error?.response?.data?.message || "OTP verification failed");
      throw error;
    }
  };

  return { verifyOtp };
};
