import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import { useNavigate } from "react-router-dom";


const Auth = () => {
  const [selectedRole, setSelectedRole] = useState<"learner" | "professional" |"admin"| null>(null);
  const navigate=useNavigate()

  const handleRoleSelect = (role: "learner" | "professional" | "admin") => {
    setSelectedRole(role);

    if (role === "learner") {
      navigate("/auth/learner");
    } else if (role === "professional") {
      navigate("/auth/profesional"); 
    } 
  };
   

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">

        {/* Main Content */}
        <div className="transition-all duration-500 ease-smooth">
          
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
            />

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