import { useState } from "react";
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
import { Edit, Lock, Send, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";

interface EditProfileDialogProps {
  userData: {
    name: string;
    email: string;
    password: boolean;
  };
  onUpdateProfile: (data: { name: string; email: string; profileImage?: string }) => void;
}

export default function EditProfileDialog({ userData, onUpdateProfile }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "email" | "password">("profile");
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailOtp, setEmailOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleSendOtp = () => {
    // Simulate OTP sending
  };

  const handleVerifyOtp = () => {};

  const handleSaveProfile = () => {
    setOpen(false);
    resetForm();
  };

  const handleSavePassword = () => {
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (!formData.currentPassword && !formData.newPassword) {
      toast.error("Please enter a password");
      return;
    }

    toast.success("Your password has been changed successfully");

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setActiveSection("profile");
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setEmailOtp("");
    setFormData({
      name: userData.name,
      email: userData.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
          {/* Profile Picture with Camera Button */}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              onClick={() => setActiveSection("profile")}
              className={activeSection === "profile" ? "border-primary" : ""}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile & Email
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveSection("password")}
              className={activeSection === "password" ? "border-primary" : ""}
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>

          <Separator />

          {/* Profile & Email Section */}
          {activeSection === "profile" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isOtpSent && !isOtpVerified}
                    />
                    {formData.email !== userData.email && !isOtpVerified && (
                      <Button variant="outline" onClick={handleSendOtp} disabled={isOtpSent}>
                        <Send className="h-4 w-4 mr-2" />
                        {isOtpSent ? "Sent" : "Send OTP"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* OTP Verification */}
                {isOtpSent && !isOtpVerified && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="otp"
                        placeholder="Enter 6-digit code"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        maxLength={6}
                      />
                      <Button onClick={handleVerifyOtp}>
                        <Check className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter verification code sent to {formData.email}
                    </p>
                  </div>
                )}

                {isOtpVerified && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-md">
                    <p className="text-sm text-success">✓ Email verified successfully</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={formData.email !== userData.email && !isOtpVerified}
                >
                  Save Profile
                </Button>
              </div>
            </div>
          )}

          {/* Password Section */}
          {activeSection === "password" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Change Password</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password (leave empty if no password set)"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
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
