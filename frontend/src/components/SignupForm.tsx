import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import type { Roles } from "@/types/role.type";

interface SignupFormProps {
  role: Roles;
  onSubmit: (role: Roles, data: { name: string; email: string; password: string }) => Promise<void>;
  onBack: () => void;
  onSwitchToLogin: () => void;
  handleGoogleSign: (role: string, credential: object) => void;
}

const SignupForm = ({
  role,
  onSubmit,
  onBack,
  onSwitchToLogin,
  handleGoogleSign,
}: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //learner signup hook

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validation functions
  const validateName = (name: string) => {
    if (!name) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
    return "";
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain a lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain an uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain a number";
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password))
      return "Password must contain a special character";
    return "";
  };
  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    let error = "";
    switch (field) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(value, formData.confirmPassword);
          setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(role, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      console.error(err);
      toast("Failed to create account. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleTitle = role === "learner" ? "Learner" : "Professional";

  return (
    <div className="w-full max-w-md mx-auto my-8 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 flex border-2 p-2 rounded-2xl items-center text-gray-500 hover:text-black"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Role Selection
      </button>

      <div className="shadow-md border border-gray-300 rounded-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Create {roleTitle} Account</h2>
          <p className="text-gray-500 mt-1">Sign up to get started on your learning journey</p>
        </div>

        <GoogleLogin
          onSuccess={(credentialRes) => handleGoogleSign(role, credentialRes)}
          onError={() => console.log("Login Failed")}
        />

        <div className="relative mb-4">
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
          {/** Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`pl-10 w-full border rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/** Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`pl-10 w-full border rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/** Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`pl-10 pr-10 w-full border rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
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
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/** Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={`pl-10 pr-10 w-full border rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md cursor-pointer"
          >
            {isLoading ? "Sending OTP..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-2">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-gray-500 hover:text-black"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
