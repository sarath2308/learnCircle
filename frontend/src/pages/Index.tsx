import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import OTPVerificationForm from "@/components/OtpVerificationForm";
import ResetPasswordForm from "@/components/ResetPassword";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<"learner" | "professional" | null>(null);
  const [currentView, setCurrentView] = useState<"role" | "login" | "signup" | "forgot-password" | "otp-verification" | "reset-password">("role");
  const [resetEmail, setResetEmail] = useState("");

  const handleRoleSelect = (role: "learner" | "professional") => {
    setSelectedRole(role);
    setCurrentView("login");
  };

  const handleBackToRoleSelection = () => {
    setCurrentView("role");
    setSelectedRole(null);
  };

  const handleSwitchToSignup = () => {
    setCurrentView("signup");
  };

  const handleSwitchToLogin = () => {
    setCurrentView("login");
  };

  const handleForgotPassword = () => {
    setCurrentView("forgot-password");
  };

  const handleOTPSent = (email: string) => {
    setResetEmail(email);
    setCurrentView("otp-verification");
  };

  const handleOTPVerified = () => {
    setCurrentView("reset-password");
  };

  const handlePasswordResetSuccess = () => {
    setCurrentView("login");
    setResetEmail("");
  };

  const handleBackFromForgot = () => {
    setCurrentView("login");
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">

        {/* Main Content */}
        <div className="transition-all duration-500 ease-smooth">
          {currentView === "role" && (
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
            />
          )}

          {currentView === "login" && selectedRole && (
            <LoginForm
              role={selectedRole}
              onBack={handleBackToRoleSelection}
              onSwitchToSignup={handleSwitchToSignup}
              onForgotPassword={handleForgotPassword}
            />
          )}

          {currentView === "signup" && selectedRole && (
            <SignupForm
              role={selectedRole}
              onBack={handleBackToRoleSelection}
              onSwitchToLogin={handleSwitchToLogin}
            />
          )}

          {currentView === "forgot-password" && (
            <ForgotPasswordForm
              onBack={handleBackFromForgot}
              onOTPSent={handleOTPSent}
            />
          )}

          {currentView === "otp-verification" && (
            <OTPVerificationForm
              email={resetEmail}
              onBack={() => setCurrentView("forgot-password")}
              onVerified={handleOTPVerified}
            />
          )}

          {currentView === "reset-password" && (
            <ResetPasswordForm
              email={resetEmail}
              onBack={() => setCurrentView("otp-verification")}
              onSuccess={handlePasswordResetSuccess}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;