import React, { useCallback } from "react";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { useNavigate } from "react-router-dom";
import { useSignup } from "@/hooks/auth/useSignup";
import { useLogin } from "@/hooks/auth/useLogin";
import { useGoogle } from "@/hooks/auth/useGoogleAuth";
import { toast } from "react-toastify";

const ProfesionalSign = () => {
  const [view, setView] = useState("login");
  const navigate = useNavigate();
  const { login } = useLogin();
  const { signup } = useSignup();
  const { mutateAsync, isPending } = useGoogle();

  const onSignUp = useCallback(
    async (role: string, data: { name: string; email: string; password: string }) => {
      try {
        const result = await signup(role, data);
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    },
    [signup],
  );

  const onLogin = useCallback(
    async (role: string, data: { email: string; password: string }) => {
      try {
        const result = await login(role, data);
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    },
    [login],
  );

  const onBack = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  const handleView = useCallback(() => {
    setView((prev) => (prev === "login" ? "signup" : "login"));
  }, []);

  const onForgotPassword = useCallback(() => {
    navigate("/auth/profesional/forgot");
  }, []);

  const handleGoogleSign = async (role: string, response: any) => {
    try {
      await mutateAsync({
        role,
        token: response.credential,
      });
      navigate(`/${role}/home`);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      {view === "login" && (
        <LoginForm
          role="profesional"
          onSubmit={onLogin}
          onBack={onBack}
          onSwitchToSignup={handleView}
          onForgotPassword={onForgotPassword}
          handleGoogleSign={handleGoogleSign}
        />
      )}

      {view === "signup" && (
        <SignupForm
          role="profesional"
          onSubmit={onSignUp}
          onBack={onBack}
          onSwitchToLogin={handleView}
          handleGoogleSign={handleGoogleSign}
        />
      )}
    </div>
  );
};

export default ProfesionalSign;
