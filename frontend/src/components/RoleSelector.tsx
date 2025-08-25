
import { Card } from "@/components/ui/card";
import { GraduationCap, Briefcase } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: "learner" | "professional"|"admin" | null;
  onRoleSelect: (role: "learner" | "professional") => void;
}

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        Choose Your Role
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <Card 
          className={`p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-soft ${
            selectedRole === "learner" 
              ? "border-primary bg-primary/5 shadow-glow" 
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => onRoleSelect("learner")}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              selectedRole === "learner" 
                ? "bg-gradient-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Learner</h3>
              <p className="text-sm text-muted-foreground">
                Access courses, track progress, and learn new skills
              </p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-soft ${
            selectedRole === "professional" 
              ? "border-accent bg-accent/5 shadow-glow" 
              : "border-border hover:border-accent/50"
          }`}
          onClick={() => onRoleSelect("professional")}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              selectedRole === "professional" 
                ? "bg-gradient-accent text-accent-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}>
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Professional</h3>
              <p className="text-sm text-muted-foreground">
                Create courses, manage content, and mentor learners
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelector;