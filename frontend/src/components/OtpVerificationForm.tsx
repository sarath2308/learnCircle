import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {RefreshCw } from "lucide-react";
import {toast} from 'react-toastify'

interface OTPVerificationFormProps {
  email: string | null;
  onVerified: (otp:string) => void;
  onResend:()=>Promise<any>;
}

const OTPVerificationForm = ({ email ,onVerified,onResend }: OTPVerificationFormProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{otp?: string}>({});
  const [timeLeft, setTimeLeft] = useState(60); 
  const [canResend, setCanResend] = useState(false);

  const validateOTP = (otp: string) => {
    if (!otp) return "Verification code is required";
    if (otp.length !== 6) return "Verification code must be 6 digits";
    if (!/^\d{6}$/.test(otp)) return "Verification code must contain only numbers";
    return "";
  };

  const TIMER_KEY = "otp_timer_end";

useEffect(() => {
  let storedEnd = localStorage.getItem(TIMER_KEY);
  let remaining = 60;

  if (storedEnd) {
    const endTime = parseInt(storedEnd);
    remaining = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
  } else {
    // First mount, store the timer end in localStorage
    const endTime = Date.now() + 60 * 1000;
    localStorage.setItem(TIMER_KEY, endTime.toString());
    remaining = 60;
  }

  setTimeLeft(remaining);
  setCanResend(remaining === 0);

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        setCanResend(true);
        localStorage.removeItem(TIMER_KEY);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const handleOTPChange = (value: string) => {
    setOtp(value);
    const error = validateOTP(value);
    setErrors(prev => ({ ...prev, otp: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpError = validateOTP(otp);
    if (otpError) {
      setErrors({ otp: otpError });
      toast( otpError);
      return;
    }

    setIsLoading(true);

   
  try {
    await onVerified(otp); 
  } catch (err) {
    toast.error("OTP verification failed");
  } finally {

    setIsLoading(false);
  }
};

  const handleResendOTP = async () => {
  setIsResending(true);
  try {
    const res = await onResend(); 
    toast( res||"otp send");
    setTimeLeft(60);
    setCanResend(false);
  } catch (err: any) {
    toast.error(err?.message || "Failed to resend OTP");
  } finally {
    setIsResending(false);
  }
};


  return (
    <div className="animate-fade-in max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Verify Your Code</h2>

      <p className="text-center text-gray-600 mb-4">
        We've sent a 6-digit verification code to:
      </p>
      <p className="text-center font-medium mb-6">{email}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 ">
          <Label htmlFor="otp" className="text-center block">
            Enter Verification Code
          </Label>
        <div className="flex justify-center">
  <InputOTP
    maxLength={6}
    value={otp}
    onChange={handleOTPChange}
    className={errors.otp ? "border-red-500" : ""}
  >
    <InputOTPGroup className="flex justify-center gap-3">
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
</div>

          {errors.otp && (
            <p className="text-sm text-red-500 text-center mt-2">{errors.otp}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !!errors.otp || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          {canResend ? (
            <Button
              type="button"
              variant="link"
              onClick={handleResendOTP}
              disabled={isResending}
              className="h-auto p-0 text-green-600 hover:underline"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin inline-block" />
                  Resending...
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          ) : (
            <p className="text-sm text-gray-500">
              Resend in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default OTPVerificationForm;