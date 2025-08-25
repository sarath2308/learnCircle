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

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

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
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">Verify Code</h2>
      </div>

      <div className="text-center mb-6">
        <p className="text-muted-foreground mb-2">
          We've sent a 6-digit verification code to:
        </p>
        <p className="font-medium">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-center block">
            Enter Verification Code
          </Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => handleOTPChange(value)}
              className={errors.otp ? "border-destructive" : ""}
            >
              <InputOTPGroup>
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
            <p className="text-sm text-destructive mt-2 text-center">{errors.otp}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !!errors.otp || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the code?
          </p>
          {canResend ? (
            <Button
              type="button"
              variant="link"
              onClick={handleResendOTP}
              disabled={isResending}
              className="h-auto p-0"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default OTPVerificationForm;