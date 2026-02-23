import ResetPasswordForm from "@/components/ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import toast from "react-hot-toast";
const ResetPassword = () => {
  const { mutateAsync: resetPassword } = useResetPassword();
  const navigate = useNavigate();
  const { email, role, tempToken } = useSelector((state: RootState) => state.signup);

  const onBack = () => {
    navigate(`/auth/${role}`);
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      if (!tempToken) {
        toast.error("token missing");
        return;
      }
      await resetPassword({
        token: tempToken,
        role,
        email,
        newPassword,
      });
      navigate(`/auth/${role}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center align-middle my-24">
      <ResetPasswordForm onBack={onBack} onSuccess={handleResetPassword} />
    </div>
  );
};

export default ResetPassword;
