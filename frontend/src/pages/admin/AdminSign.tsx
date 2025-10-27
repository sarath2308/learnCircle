import React, { useCallback } from "react";
import LoginForm from "@/components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/auth/useLogin";
import { useGoogle } from "@/hooks/auth/useGoogleAuth";
import toast from "react-hot-toast";

const AdminSign = () => {
  const navigate = useNavigate();

  const { mutateAsync: login } = useLogin();

  const { mutateAsync, isPending } = useGoogle();

  const onLogin = useCallback(
    async (role: string, data: { email: string; password: string }) => {
      try {
        const result = await login({ ...data, role });
        navigate("/admin/dashboard");
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    },
    [login],
  );

  const onBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onForgotPassword = useCallback(() => {
    navigate("/auth/forgot");
  }, []);

  const handleGoogleSign = async (role: string, response: any) => {
    console.log("fired...." + response.credential);
    try {
      await mutateAsync({
        role,
        token: response.credential,
      });
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      (
      <LoginForm
        role="admin"
        onSubmit={onLogin}
        onBack={onBack}
        onForgotPassword={onForgotPassword}
        handleGoogleSign={handleGoogleSign}
      />
      )
    </div>
  );
};

export default AdminSign;
