import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { useSignup } from "@/hooks/useSignup";
import { useLogin } from "@/hooks/useLogin";

const Auth = () => {
  const [selectedRole, setSelectedRole] = useState<"learner" | "professional" |"admin"| null>(null);
  const [currentView, setCurrentView] = useState<"role" | "login" | "signup" | "forgot-password">("role");

  const {login}=useLogin()
  const {signup}=useSignup()

  const handleRoleSelect = (role: "learner" | "professional" |"admin") => {
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
               onSubmit={login}
              onBack={handleBackToRoleSelection}
              onSwitchToSignup={handleSwitchToSignup}
              onForgotPassword={handleForgotPassword}
            />
          )}

          {currentView === "signup" && selectedRole && (
            <SignupForm
              role={selectedRole}
              onSubmit={signup}
              onBack={handleBackToRoleSelection}
              onSwitchToLogin={handleSwitchToLogin}
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

export default Auth;