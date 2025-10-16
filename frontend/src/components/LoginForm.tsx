import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { React } from "react";
interface LoginFormProps {
  role: "learner" | "profesional" | "admin";
  onSubmit: (role: string, data: { email: string; password: string }) => Promise<void>;
  onBack?: () => void;
  onSwitchToSignup?: () => void;
  onForgotPassword: () => void;
  handleGoogleSign: (role: string, credentials: object) => void;
}

const LoginForm = ({
  role,
  onSubmit,
  onBack,
  onSwitchToSignup,
  onForgotPassword,
  handleGoogleSign,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(role, { email: email, password: password });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const roleTitle = role;

  return (
    <div className="w-full max-w-md mx-auto my-8 animate-fade-in">
      {role !== "admin" && (
        <button
          onClick={onBack}
          className="mb-6 flex border-1 rounded-2xl  p-2 items-center text-gray-500 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Role Selection
        </button>
      )}

      <Card className="shadow-md border border-gray-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in as {roleTitle}</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {role !== "admin" && (
            <GoogleLogin
              onSuccess={(credentialRes) => handleGoogleSign(role, credentialRes)}
              onError={() => console.error("Login Failed")}
            />
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-200 px-2 text-gray-500 rounded-2xl">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`pl-10 border rounded-md w-full py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`pl-10 pr-10 border rounded-md w-full py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-gray-500 hover:text-black"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Switch to Signup */}
          {role !== "admin" && (
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-sm text-gray-500 hover:text-black"
              >
                Don`t have an account? Sign up
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
