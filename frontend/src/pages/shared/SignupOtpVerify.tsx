import OTPVerificationForm from "@/components/OtpVerificationForm";
import { useSignupWithOtp } from "@/hooks/auth/useSignupWithOtp";
import { useResendSignupOtp } from "@/hooks/auth/useResendSignupOtp";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const SignupOtpVerify = () => {
  const { mutateAsync: verifyOtp } = useSignupWithOtp();
  const { mutate: resendOtp } = useResendSignupOtp();
  const navigate = useNavigate();
  const { role, email } = useSelector((state: RootState) => state.signup);

  const onVerified = async (otp: string) => {
    if (!role || !email) return;
    try {
      await verifyOtp({ email, otp, role });
      navigate(`/${role}/home`);
    } catch (err) {
      console.error(err);
    }
  };

  const onResend = async () => {
    if (!role || !email) return;
    try {
      await resendOtp({ email, role });
      toast.success("OTP successfully sent");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div>
      <OTPVerificationForm role={role} email={email} onVerified={onVerified} onResend={onResend} />
    </div>
  );
};

export default SignupOtpVerify;
