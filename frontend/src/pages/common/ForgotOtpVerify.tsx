import OTPVerificationForm from "@/components/OtpVerificationForm";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useForgotOtpVerify } from "@/hooks/auth/useForgotOtpVerify";
import { useResendForgotOtp } from "@/hooks/auth/useResendForgotOtp";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { setSignupData } from "@/redux/slice/signupSlice";

const ForgotOtpVerify: React.FC = () => {
  const { mutateAsync: verifyOtp, isPending } = useForgotOtpVerify();
  const { mutateAsync: resendOtp } = useResendForgotOtp();
  const navigate = useNavigate();
  const { email, role } = useSelector((state: RootState) => state.signup);
  const dispatch = useDispatch();

  const onVerified = async (otp: string) => {
    try {
      let res: { message: string; tempToken: string } = await verifyOtp({ email, otp });
      dispatch(setSignupData({ email, role, token: res.tempToken }));
      navigate("/auth/reset-password");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const onResend = async () => {
    if (!role || !email) return;
    try {
      await resendOtp({ email });
      toast.success("OTP successfully sent");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <div>
      <OTPVerificationForm role={role} email={email} onVerified={onVerified} onResend={onResend} />
    </div>
  );
};

export default ForgotOtpVerify;
