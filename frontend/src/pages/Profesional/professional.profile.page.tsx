/* eslint-disable no-undef */
"use client";
import { useRef, useState, useEffect } from "react";
import {
  Trophy,
  Camera,
  Mail,
  X,
  Zap,
  Settings2,
  Briefcase,
  GraduationCap,
  Star,
  ShieldCheck,
  KeyRound,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

// Hooks
import { useGetProfessionalProfile } from "@/hooks/profesional/professional-profile/professional.get.profile";
import { useProfessionalProfileUpdate } from "@/hooks/profesional/professional-profile/professional.profile.update.hook";
import { useProfessionalEmailChangeRequest } from "@/hooks/profesional/professional-profile/professiona.email.change.request.hook";
import { useProfessionalVerifyOtpAndUpdate } from "@/hooks/profesional/professional-profile/professiona.profile.verify.otp.hook";
import { useProfessionalUpdatePassword } from "@/hooks/profesional/professional-profile/professional.update.password.hook";
import { useProfessionalUpdateAvatar } from "@/hooks/profesional/professional-profile/professional.avatar.update.hook";

export interface IProfessionalProfile {
  email: string;
  name: string;
  bio: string;
  companyName: string;
  experience: number;
  profileUrl: string;
  rating: number;
  sessionPrice: number;
  skills: string[];
  title: string;
  totalSessions: number;
  typesOfSessions: string[];
}

export default function InstructorProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "email" | "password">("profile");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "" });

  // API Hooks
  const { data: profileRes, isLoading, refetch } = useGetProfessionalProfile();
  const updateMutation = useProfessionalProfileUpdate();
  const reqChangeEmailMutation = useProfessionalEmailChangeRequest();
  const verifyAndChangeEmail = useProfessionalVerifyOtpAndUpdate();
  const updatePasswordMutation = useProfessionalUpdatePassword();
  const changeAvatarMutation = useProfessionalUpdateAvatar();

  const profileData: IProfessionalProfile | null = profileRes?.profileData ?? null;

  // Local Form State
  const [formState, setFormState] = useState<Partial<IProfessionalProfile>>({});

  useEffect(() => {
    if (profileData) {
      setFormState(profileData);
    }
  }, [profileData]);

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F1A]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  // --- HANDLERS ---

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Basic size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await changeAvatarMutation.mutateAsync(formData);
      toast.success("Profile picture updated!");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update avatar");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateMutation.mutateAsync({
        name: formState.name ?? "",
        bio: formState.bio ?? "",
        companyName: formState.companyName ?? "",
        experience: formState.experience ?? 0,
        title: formState.title ?? "",
      });
      setIsModalOpen(false);
      toast.success("Profile updated successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleSendOtp = async () => {
    if (formState.email === profileData.email) {
      return toast.error("This is already your current email.");
    }
    await reqChangeEmailMutation.mutateAsync({ newEmail: formState.email! });
    setIsOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    await verifyAndChangeEmail.mutateAsync(otp);
    setIsOtpSent(false);
    setIsModalOpen(false);
    setOtp("");
    refetch();
  };

  const handlePasswordUpdate = async () => {
    await updatePasswordMutation.mutateAsync({
      oldPassword: passwords.current,
      newPassword: passwords.new,
    });
    setPasswords({ current: "", new: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F1A] p-4 lg:p-10 text-slate-900 dark:text-slate-100 transition-colors">
      {/* --- HERO SECTION --- */}
      <div className="relative mb-12 mt-20">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 px-10 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
            <Avatar className="h-44 w-44 border-[8px] border-[#F8FAFC] dark:border-[#0B0F1A] shadow-2xl relative">
              <AvatarImage src={profileData.profileUrl} className="object-cover" />
              <AvatarFallback className="text-4xl font-black">
                {profileData.name?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <button
              disabled={changeAvatarMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-3 bg-white dark:bg-slate-800 text-indigo-600 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {changeAvatarMutation.isPending ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex-1 text-center md:text-left pb-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                {profileData.name}
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black text-[10px] tracking-widest px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-3 h-3 mr-1.5 inline" /> VERIFIED INSTRUCTOR
              </Badge>
            </div>
            <p className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center md:justify-start gap-2">
              <Briefcase size={14} /> {profileData.title} @ {profileData.companyName}
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="mb-6 h-14 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xl px-10 rounded-2xl group transition-all"
          >
            <Settings2 className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform duration-500 text-indigo-600" />
            <span className="font-black text-xs uppercase tracking-widest">Account Settings</span>
          </Button>
        </div>
      </div>

      {/* --- DASHBOARD CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Expertise", val: `${profileData.experience} Years`, icon: GraduationCap, color: "indigo" },
              { label: "Total Sessions", val: profileData.totalSessions, icon: Zap, color: "blue" },
              { label: "Instructor Rating", val: profileData.rating, icon: Star, color: "amber" },
            ].map((s) => (
              <Card key={s.label} className="border-none bg-white dark:bg-slate-900/50 shadow-xl rounded-[2.5rem]">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                    <p className="text-3xl font-black mt-1">{s.val}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none bg-white dark:bg-slate-900/50 shadow-2xl rounded-[3rem] p-8 md:p-12 overflow-hidden">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Professional Biography</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-lg whitespace-pre-wrap break-words">
              {profileData.bio}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {profileData.skills?.map((skill) => (
                <Badge key={skill} className="bg-slate-100 dark:bg-indigo-500/10 text-slate-600 dark:text-indigo-400 px-5 py-2.5 rounded-2xl font-black uppercase text-[10px] tracking-widest border-none">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <div className="p-12 bg-slate-900 dark:bg-indigo-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-4 opacity-70">Current Hourly Rate</h4>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-black tracking-tighter">${profileData.sessionPrice}</span>
                <span className="text-sm font-bold opacity-50">USD/HR</span>
              </div>
              <Button className="w-full h-16 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl tracking-widest text-xs">
                MANAGE AVAILABILITY
              </Button>
            </div>
            <Trophy className="absolute -right-10 -bottom-10 h-48 w-48 opacity-10 -rotate-12" />
          </div>
        </div>
      </div>

      {/* --- SETTINGS DRAWER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0B0F1A] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <h2 className="text-2xl font-black tracking-tighter uppercase">Instructor Hub</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"><X /></button>
            </div>

            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 mx-8 mt-8 rounded-2xl">
              {["profile", "email", "password"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? "bg-white dark:bg-slate-800 shadow-md text-indigo-600" : "text-slate-400 opacity-60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Public Identity</Label>
                      <Input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 px-5 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Professional Title</Label>
                      <Input value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 px-5 font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Organization</Label>
                      <Input value={formState.companyName} onChange={(e) => setFormState({ ...formState, companyName: e.target.value })} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 px-5 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Years of Practice</Label>
                      <Input type="number" value={formState.experience} onChange={(e) => setFormState({ ...formState, experience: parseInt(e.target.value) })} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 px-5 font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Biography</Label>
                    <Textarea value={formState.bio} onChange={(e) => setFormState({ ...formState, bio: e.target.value })} className="min-h-[150px] rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 p-5 font-medium leading-relaxed" />
                  </div>
                  <Button disabled={updateMutation.isPending} onClick={handleUpdateProfile} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl rounded-[1.5rem] font-black text-xs tracking-widest uppercase">
                    {updateMutation.isPending ? <Loader2 className="animate-spin" /> : "COMMIT CHANGES"}
                  </Button>
                </div>
              )}

              {activeTab === "email" && (
                <div className="space-y-8">
                  {!isOtpSent ? (
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Communications Link</Label>
                      <div className="flex gap-2">
                        <Input value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 px-5 font-bold flex-1" />
                        <Button disabled={reqChangeEmailMutation.isPending} onClick={handleSendOtp} variant="outline" className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 px-6 font-black text-xs">
                          {reqChangeEmailMutation.isPending ? "SENDING..." : "SEND OTP"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-center">
                      <div className="p-8 bg-indigo-600/5 border border-indigo-600/10 rounded-[2.5rem] space-y-6">
                        <Label className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Verify Email Access</Label>
                        <Input placeholder="000000" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="h-20 text-center text-4xl tracking-[0.5em] font-black bg-white dark:bg-slate-900 border-none rounded-2xl shadow-inner" />
                        <Button disabled={verifyAndChangeEmail.isPending} onClick={handleVerifyOtp} className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                          {verifyAndChangeEmail.isPending ? "VALIDATING..." : "VALIDATE IDENTITY"}
                        </Button>
                        <button onClick={() => setIsOtpSent(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest block w-full text-center">Back to settings</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "password" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Current Secret Key</Label>
                      <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 px-5 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Secure Key</Label>
                      <Input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 px-5 font-bold" />
                    </div>
                  </div>
                  <Button disabled={updatePasswordMutation.isPending} onClick={handlePasswordUpdate} className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest">
                    <KeyRound className="w-4 h-4 mr-2" /> {updatePasswordMutation.isPending ? "PROCESSING..." : "UPDATE ENCRYPTION"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}