import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail } from "lucide-react";
import {toast} from 'react-toastify'

interface ForgotPasswordFormProps {
  onBack: () => void;
  onOTPSent: (email: string) => void;
}

const ForgotPasswordForm = ({ onBack, onOTPSent }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
try{
    setIsLoading(true);
     await onOTPSent(email)
}catch(err)
{
  setIsLoading(false)
}
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Reset Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`pl-10 ${
                errors.email ? "border-destructive focus:ring-destructive/20" : ""
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive  mt-1 text-red-600">{errors.email}</p>
          )}
          <p className="text-sm text-muted-foreground">
            We'll send you a verification code to reset your password.
          </p>
        </div>

        <Button
          type="submit"
         className="w-full border-2 bg-black text-white hover:bg-gray-900"

        >
          {isLoading ? "Sending..." : "Send Verification Code"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm