import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { useForgotApi } from "@/hooks/auth/useForgot";
import { setSignupData } from "@/redux/slice/signupSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: getOtp } = useForgotApi();
  const role = localStorage.getItem("role") || "learner";
  const onBack = () => {
    navigate(-1);
  };
  const onOTPSent = async (email: string) => {
    const res = await getOtp({ email, role });
    dispatch(setSignupData({ role, email }));
    navigate("/auth/forgot/verify-otp");
    console.log(res);
  };
  return (
    <div className="flex justify-center align-middle my-28">
      <ForgotPasswordForm onBack={onBack} onOTPSent={onOTPSent} />
    </div>
  );
};

export default ForgotPassword;
