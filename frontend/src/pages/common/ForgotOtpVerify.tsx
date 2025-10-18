import OTPVerificationForm from "@/components/OtpVerificationForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForgotOtpVerify } from "@/hooks/auth/useForgotOtpVerify";
import { useResendForgotOtp } from "@/hooks/auth/useResendForgotOtp";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const ForgotOtpVerify: React.FC = () => {
  const { mutate: verifyOtp } = useForgotOtpVerify();
  const { mutate: resendOtp } = useResendForgotOtp();
  const navigate = useNavigate();
  const { email, role } = useSelector((state: RootState) => state.signup);

  const onVerified = async (otp: string) => {
    try {
      await verifyOtp({ email, otp });
      navigate("/auth/reset-password");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const onResend = async () => {
    if (!role || !type || !email) return;
    try {
      await resendOtp({ email });
      toast.success("OTP successfully sent");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <OTPVerificationForm role={role} email={email} onVerified={onVerified} onResend={onResend} />
    </div>
  );
};

export default ForgotOtpVerify;
