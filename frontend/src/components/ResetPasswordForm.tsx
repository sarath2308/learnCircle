import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ResetPasswordFormProps {
  onBack: () => void;
  onSuccess: (newPassword: string) => void;
}

const ResetPasswordForm = ({ onBack, onSuccess }: ResetPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const passwordRequirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
    { text: "Contains number", met: /\d/.test(newPassword) },
    { text: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
  ];

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    const error = validatePassword(value);
    setErrors((prev) => ({ ...prev, newPassword: error }));

    // Also revalidate confirm password if it exists
    if (confirmPassword) {
      const confirmError = validateConfirmPassword(value, confirmPassword);
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    const error = validateConfirmPassword(newPassword, value);
    setErrors((prev) => ({ ...prev, confirmPassword: error }));
  };

  const isPasswordValid = passwordRequirements.every((req) => req.met);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);

    if (passwordError || confirmError) {
      setErrors({
        newPassword: passwordError,
        confirmPassword: confirmError,
      });
      toast("Please fix the errors below");
      return;
    }
    setIsLoading(true);
    await onSuccess(newPassword);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Set New Password</h2>
      </div>

      <div className="text-center mb-6">
        <p className="text-muted-foreground">Create a strong password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`pl-10 pr-10 ${
                errors.newPassword ? "border-destructive focus:ring-destructive/20" : ""
              }`}
              placeholder="Enter new password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {newPassword.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Password Requirements:</p>
            <div className="space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle
                    className={`h-3 w-3 ${req.met ? "text-green-500" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-xs ${req.met ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive mt-1">{errors.newPassword}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className={`pl-10 pr-10 ${
                errors.confirmPassword ? "border-destructive focus:ring-destructive/20" : ""
              }`}
              placeholder="Confirm new password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
          )}
          {confirmPassword.length > 0 && !errors.confirmPassword && (
            <p className={`text-xs ${passwordsMatch ? "text-green-500" : "text-destructive"}`}>
              {passwordsMatch ? "Passwords match" : "Passwords do not match"}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full !bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            isLoading ||
            !!errors.newPassword ||
            !!errors.confirmPassword ||
            !isPasswordValid ||
            !passwordsMatch
          }
        >
          {isLoading ? "Updating Password..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
