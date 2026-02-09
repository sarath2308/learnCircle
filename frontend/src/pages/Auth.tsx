import { useState } from "react";
import RoleSelector from "@/components/RoleSelector";
import { useNavigate } from "react-router-dom";
import type { Roles } from "@/types/role.type";

const Auth = () => {
  const [selectedRole, setSelectedRole] = useState<Roles | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role: Roles) => {
    setSelectedRole(role);
    localStorage.setItem("role", role);
    
    // Adding a slight delay so the user sees the "Selected" state animation
    setTimeout(() => {
      if (role === "learner") {
        navigate("/auth/learner");
      } else if (role === "professional") {
        navigate("/auth/professional");
      }
    }, 400);
  };

  return (
    <div className="relative min-h-screen w-ful flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      
      {/* BACKGROUND ELEMENTS: The "Mesh" Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Blob */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] animate-pulse" />
        
        {/* Accent Blob */}
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[100px] transition-all duration-1000" />
        
        {/* Subtle Bottom Glow */}
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-purple-400/10 dark:bg-purple-900/10 blur-[120px]" />
        
        {/* Subtle Grid Overlay (Optional but adds texture) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto py-12">
        <div className="transition-all duration-500 transform scale-100 hover:scale-[1.01]">
          <RoleSelector 
            selectedRole={selectedRole} 
            onRoleSelect={handleRoleSelect} 
          />
        </div>

        {/* Brand Footer Section */}
        <div className="mt-12 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="flex items-center justify-center gap-2 opacity-50">
              <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Secure Authentication
              </span>
              <div className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;