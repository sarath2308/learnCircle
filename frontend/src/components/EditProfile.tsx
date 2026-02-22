"use client";
import React, { useState, useEffect } from "react";
import { Mail, Lock, User, ShieldCheck, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditProfileDialogProps {
  userData: {
    name: string;
    email: string;
    hasPassword: boolean;
  };
  onUpdateProfile: (data: { name: string }) => Promise<void>;
  onRequestEmailOtp: (data: { email: string }) => Promise<void>;
  onVerifyOtp: (data: { otp: string }) => Promise<void>;
  onUpdateEmail: (data: { email: string }) => Promise<void>;
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
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: userData.name, email: userData.email });
  const [passwords, setPasswords] = useState({ newPassword: "", password: "" });

  const [emailOtp, setEmailOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: userData.name, email: userData.email });
      setPasswords({ newPassword: "", password: "" });
      setIsOtpVerified(false);
      setIsOtpSent(false);
      setEmailOtp("");
    }
  }, [isOpen, userData]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSendOtp = async () => {
    try {
      await onRequestEmailOtp({ email: formData.email });
      setIsOtpSent(true);
      setTimeLeft(60);
      toast.success("OTP sent successfully");
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const handleVerify = async () => {
    try {
      await onVerifyOtp({ otp: emailOtp });
      setIsOtpVerified(true);
      toast.success("Email verified");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  const executeAction = async (action: () => Promise<void>) => {
    try {
      await action();
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
          Edit Profile
        </Button>
      </DialogTrigger>

      {/* Explicitly set bg-white and z-50 to fix the transparency and overlapping seen in your screenshot */}
      <DialogContent className="sm:max-w-[450px] bg-white dark:bg-zinc-950 border shadow-2xl rounded-2xl p-0 overflow-hidden z-[100]">
        <div className="absolute right-4 top-4 z-10">
          <DialogClose className="rounded-full p-1 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </DialogClose>
        </div>

        <DialogHeader className="p-6 bg-gray-50/50 dark:bg-zinc-900/50 border-b">
          <DialogTitle className="text-xl font-semibold">Account Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="flex w-full justify-start rounded-none border-b bg-transparent h-12 px-4 gap-2">
            <TabsTrigger
              value="profile"
              className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
            >
              Security
            </TabsTrigger>
          </TabsList>

          <div className="p-6 space-y-4">
            {/* PROFILE SECTION */}
            <TabsContent value="profile" className="mt-0 space-y-4 outline-none">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <Button
                className="w-full bg-primary"
                onClick={() => executeAction(() => onUpdateProfile({ name: formData.name }))}
              >
                Save Changes
              </Button>
            </TabsContent>

            {/* EMAIL SECTION */}
            <TabsContent value="email" className="mt-0 space-y-4 outline-none">
              <div className="space-y-2">
                <Label>New Email Address</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      disabled={isOtpVerified}
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="shrink-0"
                    disabled={timeLeft > 0 || isOtpVerified}
                    onClick={handleSendOtp}
                  >
                    {timeLeft > 0 ? `${timeLeft}s` : "Send OTP"}
                  </Button>
                </div>
              </div>

              {isOtpSent && !isOtpVerified && (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                  <Label>Verification Code</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter 6-digit code"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                    />
                    <Button variant="secondary" onClick={handleVerify}>
                      Verify
                    </Button>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!isOtpVerified}
                onClick={() => executeAction(() => onUpdateEmail({ email: formData.email }))}
              >
                Confirm New Email
              </Button>
            </TabsContent>

            {/* PASSWORD SECTION */}
            <TabsContent value="password" className="mt-0 space-y-4 outline-none">
              {userData.hasPassword && (
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      className="pl-10"
                      value={passwords.password}
                      onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    className="pl-10"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => executeAction(() => onUpdatePassword(passwords))}
              >
                Update Password
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
