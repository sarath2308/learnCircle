import ResetPasswordForm from "@/components/ResetPasswordForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { mutateAsync, isPending } = useResetPassword();
  const navigate = useNavigate();

  const role = searchParams.get("role");
  const token = searchParams.get("token");
  const onBack = () => {
    navigate(`/auth/${role}`);
  };

  const handleResetPassword = async (newPassword: string) => {
    try {
      await mutateAsync({
        role,
        token,
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
