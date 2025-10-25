import React, { useCallback } from "react";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { useNavigate } from "react-router-dom";
import { useReqSignup } from "@/hooks/auth/useReqSignup";
import { useLogin } from "@/hooks/auth/useLogin";
import { useGoogle } from "@/hooks/auth/useGoogleAuth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSignupData } from "@/redux/slice/signupSlice";
import { useRequestEmailChangeOtp } from "@/hooks/learner/profile/useRequestEmailChangeOtp";
import { useResendEmailChangeOtp } from "@/hooks/learner/profile/useResendEmailChangeOtp";

const LearnerSign = () => {
  const [view, setView] = useState("login");

  const navigate = useNavigate();

  const { mutateAsync: login } = useLogin();

  const { mutateAsync: reqSignup } = useReqSignup();

  const { mutateAsync, isPending } = useGoogle();

  const dispatch = useDispatch();
  const onSignUp = useCallback(
    async (role: string, data: { name: string; email: string; password: string }) => {
      try {
        const result = await reqSignup({ ...data, role });
        dispatch(setSignupData({ email: data.email, role: role }));
        navigate("/auth/signup/verify-otp");
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    },
    [reqSignup],
  );

  const onLogin = useCallback(
    async (role: string, data: { email: string; password: string }) => {
      try {
        const result = await login({ ...data, role });
        navigate("/learner/home");
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
    console.log("fired...." + response.credential);
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
          role="learner"
          onSubmit={onLogin}
          onBack={onBack}
          onSwitchToSignup={handleView}
          onForgotPassword={onForgotPassword}
          handleGoogleSign={handleGoogleSign}
        />
      )}

      {view === "signup" && (
        <SignupForm
          role="learner"
          onSubmit={onSignUp}
          onBack={onBack}
          onSwitchToLogin={handleView}
          handleGoogleSign={handleGoogleSign}
        />
      )}
    </div>
  );
};

export default LearnerSign;
