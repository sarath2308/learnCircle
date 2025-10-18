import ResetPasswordForm from "@/components/ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
const ResetPassword = () => {
  const { mutate: resetPassword, isPending } = useResetPassword();
  const navigate = useNavigate();
  const { email, role } = useSelector((state: RootState) => state.signup);

  const onBack = () => {
    navigate(`/auth/${role}`);
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      await resetPassword({
        role,
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
