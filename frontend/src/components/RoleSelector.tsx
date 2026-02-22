import { Card } from "@/components/ui/card";
import type { Roles } from "@/types/role.type";
import { GraduationCap, Briefcase, CheckCircle2 } from "lucide-react";
import React from "react";
import Magnet from "./Magnet";
import AnimatedContent from "./AnimatedContent";

interface RoleSelectorProps {
  selectedRole: Roles | null;
  onRoleSelect: (role: Roles) => void;
}

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: "learner" as Roles,
      title: "Learner",
      description: "Access courses, track progress, and book sessions with experts.",
      icon: <GraduationCap className="w-7 h-7" />,
      // Explicit styles to avoid Tailwind JIT issues
      activeStyles:
        "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]",
      iconStyles: "bg-blue-600 text-white",
      hoverStyles: "hover:border-blue-300 dark:hover:border-blue-800",
    },
    {
      id: "professional" as Roles,
      title: "Professional",
      description: "Manage your availability, host sessions, and mentor learners.",
      icon: <Briefcase className="w-7 h-7" />,
      activeStyles:
        "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]",
      iconStyles: "bg-indigo-600 text-white",
      hoverStyles: "hover:border-indigo-300 dark:hover:border-indigo-800",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 text-center">
      <div className="space-y-3 mb-12">
        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
          Select Your Path
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
          Tailor your experience. Choose how you want to interact with the community today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <Magnet key={role.id} padding={20} disabled={false} magnetStrength={30}>
              <AnimatedContent
                distance={20}
                direction="up"
                duration={0.4}
                scale={1}
                threshold={0.1}
                delay={0.1}
              >
                <Card
                  onClick={() => onRoleSelect(role.id)}
                  className={`relative p-8 border-2 cursor-pointer transition-all duration-500 rounded-[2.5rem] overflow-hidden group
                    ${isSelected ? role.activeStyles : `bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 ${role.hoverStyles}`}
                  `}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                      <CheckCircle2
                        className={`w-6 h-6 ${role.id === "learner" ? "text-blue-500" : "text-indigo-500"}`}
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center space-y-6">
                    <div
                      className={`p-4 rounded-2xl transition-all duration-500 transform group-hover:scale-110
                      ${isSelected ? role.iconStyles : "bg-slate-100 dark:bg-slate-800 text-slate-500"}
                    `}
                    >
                      {role.icon}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                        {role.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedContent>
            </Magnet>
          );
        })}
      </div>

      <div className="mt-12 space-y-4">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">
          Legal Agreement
        </p>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="text-slate-600 dark:text-slate-300 underline font-bold hover:text-blue-500 transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-slate-600 dark:text-slate-300 underline font-bold hover:text-blue-500 transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default RoleSelector;
