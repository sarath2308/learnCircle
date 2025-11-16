import { Card } from "@/components/ui/card";
import type { Roles } from "@/types/role.type";
import { GraduationCap, Briefcase } from "lucide-react";
import React from "react";
import Magnet from "./Magnet";
import AnimatedContent from "./AnimatedContent";
interface RoleSelectorProps {
  selectedRole: Roles | null;
  onRoleSelect: (role: "learner" | "professional") => void;
}

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: "learner",
      title: "Learner",
      description: "Access courses, track progress, and learn new skills",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "primary",
    },
    {
      id: "professional",
      title: "Professional",
      description: "Create courses, manage content, and mentor learners",
      icon: <Briefcase className="w-6 h-6" />,
      color: "accent",
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-3 text-foreground">Choose Your Role</h2>
      <p className="text-muted-foreground mb-8">Select how you want to use the platform</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <Magnet key={role.id} padding={50} disabled={false} magnetStrength={60}>
              <AnimatedContent
                distance={40}
                direction="up"
                reverse={false}
                duration={0.6}
                ease="easeOut"
                initialOpacity={0}
                animateOpacity
                scale={1.02}
                threshold={0.15}
                delay={0.1}
              >
                <Card
                  className={`p-6 border-2 cursor-pointer transition-all duration-300 rounded-2xl 
                ${
                  isSelected
                    ? `border-${role.color} bg-${role.color}/10 shadow-md scale-[1.02]`
                    : "border-border hover:border-foreground/40 hover:shadow-sm"
                }`}
                  onClick={() => onRoleSelect(role.id as Roles)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`p-3 rounded-full transition-colors 
                    ${
                      isSelected
                        ? `bg-${role.color} text-${role.color}-foreground`
                        : "bg-secondary text-secondary-foreground"
                    }`}
                    >
                      {role.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug">{role.description}</p>
                  </div>
                </Card>
              </AnimatedContent>
            </Magnet>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        By continuing, you agree to our{" "}
        <a href="#" className="underline hover:text-foreground">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default RoleSelector;
