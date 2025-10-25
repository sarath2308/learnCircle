"use client";
import React, { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProfileDialogProps {
  userData: {
    name: string;
    email: string;
    hasPassword: boolean;
  };
  onUpdateProfile: (data: { name: string }) => Promise<void>;
  onRequestEmailOtp: (data: { email: string }) => Promise<void>;
  onVerifyOtp: (data: { otp: string }) => Promise<void>;
  onUpdateEmail: (data: { newEmail: string }) => Promise<void>;
  onUpdatePassword: (data: { newPassword: string; password?: string }) => Promise<void>;
}

const EditProfileDialog = ({
  userData,
  onUpdateProfile,
  onRequestEmailOtp,
  onVerifyOtp,
  onUpdateEmail,
  onUpdatePassword,
}: EditProfileDialogProps) => {
  const [activeTab, setActiveTab] = useState<"profile" | "email" | "password">("profile");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: userData.name, email: userData.email });
  const [passwords, setPasswords] = useState({ newPassword: "", password: "" });

  // OTP state
  const [emailOtp, setEmailOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const OTP_TIMER_KEY = "otp_timer";

  const closeDialog = () => {
    setIsOpen(false);
    setActiveTab("profile");
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setEmailOtp("");
  };

  // 🕒 Timer setup for resend OTP
  useEffect(() => {
    const savedExpiry = localStorage.getItem(OTP_TIMER_KEY);
    if (savedExpiry) {
      const remaining = Math.floor((parseInt(savedExpiry) - Date.now()) / 1000);
      if (remaining > 0) setTimeLeft(remaining);
    }
  }, []);

  useEffect(() => {
    if (!timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem(OTP_TIMER_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // 📨 Send OTP
  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      await onRequestEmailOtp({ email: formData.email });
      toast.success("OTP sent successfully");
      setIsOtpSent(true);
      const expiry = Date.now() + 60 * 1000;
      localStorage.setItem(OTP_TIMER_KEY, expiry.toString());
      setTimeLeft(60);
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtpClick = async () => {
    try {
      await onVerifyOtp({ otp: emailOtp });
      toast.success("OTP verified successfully");
      setIsOtpVerified(true);
    } catch {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  // 💾 Save profile
  const handleSaveProfile = async () => {
    try {
      await onUpdateProfile({ name: formData.name });
      toast.success("Profile updated successfully");
      closeDialog();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  // 📧 Save new email
  const handleSaveEmail = async () => {
    if (!isOtpVerified) {
      toast.error("Please verify the OTP first");
      return;
    }
    try {
      await onUpdateEmail({ email: formData.email });
      toast.success("Email updated successfully");
      closeDialog();
    } catch {
      toast.error("Failed to update email");
    }
  };

  // 🔐 Save new password
  const handleSavePassword = async () => {
    try {
      if (userData.hasPassword) {
        await onUpdatePassword({
          newPassword: passwords.newPassword,
          password: passwords.password,
        });
      } else {
        await onUpdatePassword({ newPassword: passwords.newPassword });
      }

      closeDialog();
    } catch {
      toast.error("Failed to update password");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="rounded-xl border-primary text-primary"
        onClick={() => setIsOpen(true)}
      >
        Edit Profile
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex justify-around mb-6 border-b">
            {["profile", "email", "password"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-2 capitalize ${
                  activeTab === tab ? "border-b-2 border-primary text-primary" : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          )}

          {/* EMAIL TAB */}
          {activeTab === "email" && (
            <div className="space-y-4">
              <div>
                <Label>New Email</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Button variant="outline" onClick={handleSendOtp} disabled={timeLeft > 0}>
                    {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Send OTP"}
                  </Button>
                </div>
              </div>

              {isOtpSent && (
                <div>
                  <Label>Enter OTP</Label>
                  <div className="flex gap-2">
                    <Input
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                    <Button variant="outline" onClick={handleVerifyOtpClick}>
                      Verify OTP
                    </Button>
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={handleSaveEmail} disabled={!isOtpVerified}>
                Save Email
              </Button>
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwords.password}
                  onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleSavePassword}>
                Save Password
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileDialog;
