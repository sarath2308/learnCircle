import OTPVerificationForm from '@/components/OtpVerificationForm'
import { useSearchParams } from 'react-router-dom';
import React from 'react'
import { useOtpVerify } from '@/hooks/useOtpVerify';
import { useOtpResend } from '@/hooks/useResendOtp';


const LearnerOtpVerification:React.FC= () => {
  const {verifyOtp} =useOtpVerify()
  const {resendOtp}=useOtpResend()
  const [searchParams] = useSearchParams();
  
  const role = searchParams.get("role");  
  const type= searchParams.get("type"); 
  const email=searchParams.get("email")
  

const onVerified = async (otp: string) => {
  try {
    await verifyOtp(role, { email, otp, type });
  } catch (err) {
    throw err; 
  }
};
const  onResend=async()=>
  {
    try {
    let res=await resendOtp(role,{email,type})
    return res;
    } catch (error) {
     console.log(error)
     throw error;
    }
  }
  return (
    <div>
        <OTPVerificationForm email={email} 
        onVerified={onVerified}
        onResend={onResend}
        />
    </div>
  )
}

export default LearnerOtpVerification