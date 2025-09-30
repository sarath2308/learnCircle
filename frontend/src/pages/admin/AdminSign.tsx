import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { useLogin } from "@/hooks/auth/useLogin";
import { useGoogle } from "@/hooks/auth/useGoogleAuth";
import { toast } from "react-toastify";

const AdminSign = () => {
  const navigate = useNavigate();
  const { login } = useLogin();
  const { mutateAsync } = useGoogle();

  const onLogin = useCallback(
    async (role: string, data: { email: string; password: string }) => {
      try {
        const result = await login(role, data);
        console.log(result);
        navigate(`/${role}/home`);
      } catch (err) {
        console.error(err);
        toast.error("Login failed. Please check your credentials.");
      }
    },
    [login, navigate],
  );

  const onForgotPassword = useCallback(() => {
    navigate("/auth/admin/forgot");
  }, [navigate]);

  const handleGoogleSign = useCallback(
    async (role: string, response: any) => {
      console.log("fired...." + response.credential);
      try {
        await mutateAsync({
          role,
          token: response.credential,
        });
        navigate(`/${role}/home`);
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Google login failed. Please try again.");
      }
    },
    [mutateAsync, navigate],
  );

  return (
    <div>
      <LoginForm
        role="admin"
        onSubmit={onLogin}
        onForgotPassword={onForgotPassword}
        handleGoogleSign={handleGoogleSign}
      />
    </div>
  );
};

export default AdminSign;
