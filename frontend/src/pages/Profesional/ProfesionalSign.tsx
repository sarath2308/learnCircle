import React, { useCallback } from "react";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { useNavigate } from "react-router-dom";
import { useReqSignup } from "@/hooks/auth/useReqSignup";
import { useLogin } from "@/hooks/auth/useLogin";
import { useGoogle } from "@/hooks/auth/useGoogleAuth";
import toast from "react-hot-toast";
import { ROLE } from "@/contstant/role";
import { useDispatch } from "react-redux";
import { setSignupData } from "@/redux/slice/signupSlice";

const ProfesionalSign = () => {
  const [view, setView] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutateAsync: login } = useLogin();
  const { mutateAsync: signup } = useReqSignup();
  const { mutateAsync, isPending } = useGoogle();

  const onSignUp = useCallback(
    async (role: string, data: { name: string; email: string; password: string }) => {
      try {
        const result = await signup({ ...data, role });
        navigate("/auth/signup/verify-otp");
        dispatch(setSignupData({ email: data.email, role }));
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
        const result = await login({ ...data, role });
        navigate(`/${role}/home`,{ replace: true });
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
    navigate("/auth/forgot");
  }, []);

  const handleGoogleSign = async (role: string, response: any) => {
    try {
      await mutateAsync({
        role,
        token: response.credential,
      });
      navigate(`/${role}/home`,{ replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div>
      {view === "login" && (
        <LoginForm
          role={ROLE.PROFESSIONAL}
          onSubmit={onLogin}
          onBack={onBack}
          onSwitchToSignup={handleView}
          onForgotPassword={onForgotPassword}
          handleGoogleSign={handleGoogleSign}
        />
      )}

      {view === "signup" && (
        <SignupForm
          role={ROLE.PROFESSIONAL}
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
