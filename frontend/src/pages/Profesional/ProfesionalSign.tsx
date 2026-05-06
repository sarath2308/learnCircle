import { useCallback } from "react";
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
  const { mutateAsync } = useGoogle();

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
        navigate(`/${role}/home`, { replace: true });
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
      navigate("/professional/home", { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 relative">
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 z-10 max-w-xs w-full sm:w-80">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Demo Login Credentials</h3>
        <p className="text-xs text-gray-500 mb-4">Click to copy credentials for testing.</p>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs font-medium mb-1">Email</span>
            <div 
              className="bg-blue-50 px-3 py-2 rounded text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors font-mono text-xs break-all border border-blue-100 flex justify-between items-center"
              onClick={() => copyToClipboard("reggina.gowdy@inboxorigin.com")}
              title="Click to copy email"
            >
              <span>reggina.gowdy@inboxorigin.com</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 bg-white px-1.5 py-0.5 rounded shadow-sm border border-blue-200">Copy</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs font-medium mb-1">Password</span>
            <div 
              className="bg-blue-50 px-3 py-2 rounded text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors font-mono text-xs break-all border border-blue-100 flex justify-between items-center"
              onClick={() => copyToClipboard("Example@123")}
              title="Click to copy password"
            >
              <span>Example@123</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 bg-white px-1.5 py-0.5 rounded shadow-sm border border-blue-200">Copy</span>
            </div>
          </div>
        </div>
      </div>

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
