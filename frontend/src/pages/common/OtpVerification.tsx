import OTPVerificationForm from '@/components/OtpVerificationForm'
import { useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { useOtpVerify } from '@/hooks/auth/useOtpVerify';
import { useOtpResend } from '@/hooks/auth/useResendOtp';
import { toast } from 'react-toastify';

const OtpVerification: React.FC = () => {
  const { verifyOtp } = useOtpVerify();
  const { resendOtp } = useOtpResend();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Set query params after mount
  useEffect(() => {
    const r = searchParams.get('role');
    const t = searchParams.get('type');
    const e = searchParams.get('email');

    if (!r || !t || !e) {
      toast.error('Missing required query parameters');
      return;
    }

    setRole(r);
    setType(t);
    setEmail(e);
    setLoading(false);
  }, [searchParams]);

  const onVerified = async (otp: string) => {
    if (!role || !type || !email) return;
    try {
      await verifyOtp(role, { email, otp, type });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const onResend = async () => {
    if (!role || !type || !email) return;
    try {
      await resendOtp(role, { email, type });
      toast.success("OTP successfully sent");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <OTPVerificationForm
        role={role}
        email={email}
        onVerified={onVerified}
        onResend={onResend}
      />
    </div>
  );
};

export default OtpVerification;
