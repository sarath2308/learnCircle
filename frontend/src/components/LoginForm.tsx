import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
interface LoginFormProps {
  role: "learner" | "professional"|"admin";
  onSubmit:(role:string,data:{email:string,password:string})=>Promise<void>
  onBack: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
  handleGoogleSign:(role:string,credentials:any)=>void;
}

const LoginForm = ({ role,onSubmit, onBack, onSwitchToSignup, onForgotPassword ,handleGoogleSign}: LoginFormProps) => {
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
    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
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
    try{
      await onSubmit(role,{email:email,password:password})
    }catch(err)
    {
      setIsLoading(false)
    }

  
  };

  const roleTitle = role === "learner" ? "Learner" : "Professional";

  return (
    <div className="w-full max-w-md mx-auto my-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 flex border-1 rounded-2xl  p-2 items-center text-gray-500 hover:text-black"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Role Selection
      </button>

      <Card className="shadow-md border border-gray-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in as {roleTitle}</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Sign In */}
          {/* <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md transition"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            Continue with Google
          </button> */}
          <GoogleLogin onSuccess={(credentialRes)=>handleGoogleSign(role,credentialRes)} onError={() => console.log("Login Failed")} />

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
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
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
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-sm text-gray-500 hover:text-black"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
