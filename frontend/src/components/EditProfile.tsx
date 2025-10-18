import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Lock, Send, Check, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { React } from "react";
interface EditProfileDialogProps {
  userData: {
    name: string;
    email: string;
    hasPassword: boolean;
  };
  onUpdateProfile: (data: { name?: string }) => void;
  onUpdateEmail: (data: { email: string }) => void;
  onUpdatePassword?: (data: { currentPassword: string; newPassword: string }) => void;
  onVerifyOtp?: (data: { otp: string }) => void;
  onResendOtp?: () => void;
}

const OTP_TIMER_KEY = "email_otp_expiry";

export default function EditProfileDialog({
  userData,
  onUpdateProfile,
  onUpdateEmail,
  onVerifyOtp,
  onResendOtp,
  onUpdatePassword,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "email" | "password">("profile");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync formData whenever userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name,
        email: userData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [userData]);

  // OTP state
  const [emailOtp, setEmailOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer setup
  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem(OTP_TIMER_KEY);
      if (expiry) {
        const remaining = Math.floor((+expiry - Date.now()) / 1000);
        if (remaining > 0) {
          setTimeLeft(remaining);
        } else {
          localStorage.removeItem(OTP_TIMER_KEY);
          setTimeLeft(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleSendOtp = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("OTP sent to your email!");
    setIsOtpSent(true);
    const expiry = Date.now() + 60 * 1000;
    localStorage.setItem(OTP_TIMER_KEY, expiry.toString());
    setTimeLeft(60);
  };

  const handleVerifyOtpClick = () => {
    if (emailOtp === "123456") {
      setIsOtpVerified(true);
      toast.success("Email verified successfully");
    } else {
      toast.error("Invalid OTP");
    }
  };

  const handleSaveProfile = () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    onUpdateProfile({ name: formData.name });
    closeDialog();
  };

  const handleSaveEmail = () => {
    if (!isOtpVerified) {
      toast.error("Please verify your new email first");
      return;
    }
    onUpdateEmail({ email: formData.email });
    toast.success("Email updated successfully");
    closeDialog();
  };

  const handleSavePassword = () => {
    if (!formData.newPassword || formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (onUpdatePassword) {
      onUpdatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
    }
    toast.success("Password updated successfully");
    closeDialog();
  };

  const closeDialog = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setActiveSection("profile");
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setEmailOtp("");
    setTimeLeft(0);
    localStorage.removeItem(OTP_TIMER_KEY);
    if (userData) {
      setFormData({
        name: userData.name,
        email: userData.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section Switch */}
          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              onClick={() => setActiveSection("profile")}
              className={activeSection === "profile" ? "border-primary" : ""}
            >
              <Edit className="h-4 w-4 mr-2" /> Profile Info
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveSection("email")}
              className={activeSection === "email" ? "border-primary" : ""}
            >
              <Mail className="h-4 w-4 mr-2" /> Change Email
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveSection("password")}
              className={activeSection === "password" ? "border-primary" : ""}
            >
              <Lock className="h-4 w-4 mr-2" /> Change Password
            </Button>
          </div>

          <Separator />

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="space-y-4">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>Save</Button>
              </div>
            </div>
          )}

          {/* Email Section */}
          {activeSection === "email" && (
            <div className="space-y-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isOtpSent && !isOtpVerified}
              />
              {!isOtpVerified && (
                <Button variant="outline" onClick={handleSendOtp} disabled={timeLeft > 0}>
                  <Send className="h-4 w-4 mr-2" />
                  {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Send OTP"}
                </Button>
              )}
              {isOtpSent && !isOtpVerified && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit code"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      maxLength={6}
                    />
                    <Button onClick={handleVerifyOtpClick}>
                      <Check className="h-4 w-4 mr-2" /> Verify
                    </Button>
                  </div>
                </div>
              )}
              {isOtpVerified && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-md">
                  <p className="text-sm text-success">✓ Email verified successfully</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEmail} disabled={!isOtpVerified}>
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Password Section */}
          {activeSection === "password" && (
            <div className="space-y-4">
              {userData.hasPassword && (
                <>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                </>
              )}
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSavePassword}>Update Password</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
