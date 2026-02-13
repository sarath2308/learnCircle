"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { 
  Trophy, Clock, Camera, Mail, X, Zap, ChevronRight, Settings2, AlertCircle 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import profilePicture from "@/assets/profile.jpg";

// Hooks
import { useUpdateAvatar } from "@/hooks/learner/profile/useUpdateAvatar";
import { useUpdatePassword } from "@/hooks/learner/profile/useUpdatePassword";
import { useGetProfile } from "@/hooks/learner/profile/useGetProfile";
import { useUpdatName } from "@/hooks/learner/profile/useUpdateName";
import { useRequestEmailChangeOtp } from "@/hooks/learner/profile/useRequestEmailChangeOtp";
import { useVerifyAndUpdateEmail } from "@/hooks/learner/profile/useVerifyAndUpdateEmail";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function LearnerProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "email" | "password">("profile");

  const { data: userData, isLoading } = useGetProfile();
  const { mutateAsync: updateAvatar, isPending: avatarLoading } = useUpdateAvatar();
  const { mutateAsync: updatePassword, isPending: passwordLoading } = useUpdatePassword();
  const { mutateAsync: requestEmailOtp, isPending: otpLoading } = useRequestEmailChangeOtp();
  const { mutateAsync: verifyAndChangeEmail, isPending: verifyLoading } = useVerifyAndUpdateEmail();
  const { mutateAsync: updateName, isPending: nameLoading } = useUpdatName();

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Validation
  const isEmailSame = useMemo(() => formEmail.toLowerCase() === userData?.email?.toLowerCase(), [formEmail, userData?.email]);
  const isPasswordWeak = passwords.new.length > 0 && passwords.new.length < 8;
  const isPasswordSame = passwords.new.length > 0 && passwords.new === passwords.current;

  useEffect(() => {
    if (userData) { setFormName(userData.name || ""); setFormEmail(userData.email || ""); }
  }, [userData, isModalOpen]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#0B0F1A]">
      <div className="animate-pulse text-indigo-600 dark:text-indigo-400 font-black tracking-tighter uppercase">Initializing Core...</div>
    </div>
  );

  const { name = "User", email = "-", profileImg = profilePicture, streak = 1 } = userData || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F1A] p-4 lg:p-10 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <div className="relative mb-12">
        <div className="h-52 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/10">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-10 -mt-20 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <Avatar className="h-36 w-36 border-[6px] border-[#F8FAFC] dark:border-[#0B0F1A] shadow-2xl relative">
              <AvatarImage src={profileImg} className="object-cover" />
              <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-3xl font-black">{name[0]}</AvatarFallback>
            </Avatar>
            <button 
              disabled={avatarLoading}
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1.5 right-1.5 p-2.5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border border-slate-100 dark:border-slate-700"
            >
              <Camera className="h-5 w-5" />
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={async (e) => {
              const file = e.target.files?.[0];
              if(file) { await updateAvatar(file); queryClient.invalidateQueries({queryKey: ['profile']}); toast.success("Visuals Updated"); }
            }} />
          </div>

          <div className="flex-1 text-center md:text-left pb-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">{name}</h1>
              <Badge className="bg-orange-500 text-white border-none px-4 py-1.5 rounded-full flex gap-1.5 items-center font-black text-[10px] tracking-widest shadow-lg shadow-orange-500/20">
                <Zap className="h-3 w-3 fill-current" /> {streak} DAY STREAK
              </Badge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2">
              <Mail className="h-4 w-4 opacity-70" /> {email}
            </p>
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="mb-4 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xl px-8 rounded-2xl group transition-all"
          >
            <Settings2 className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-500 text-indigo-600 dark:text-indigo-400" />
            <span className="font-black text-xs uppercase tracking-widest">Account Settings</span>
          </Button>
        </div>
      </div>

      {/* --- DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Learning Hours", val: "24.5h", icon: Clock, color: "blue" },
              { label: "Certificates", val: "12", icon: Trophy, color: "amber" },
              { label: "Global Rank", val: "#128", icon: Zap, color: "emerald" },
            ].map((s) => (
              <Card key={s.label} className="border-none bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/60 dark:shadow-none rounded-[2rem] hover:-translate-y-1 transition-all">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-2xl bg-${s.color}-500/10 text-${s.color}-600 dark:text-${s.color}-400`}>
                    <s.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{s.label}</p>
                    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white">{s.val}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none bg-white dark:bg-slate-900/60 shadow-2xl shadow-indigo-100 dark:shadow-none rounded-[2.5rem] p-10">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Curriculum Mastery</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Real-time performance metrics</p>
                </div>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 italic">68%</span>
            </div>
            <div className="h-5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" style={{width: '68%'}} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-6 font-bold flex items-center gap-2 uppercase tracking-tight">
                <ChevronRight className="h-4 w-4 text-indigo-500" /> Advanced Tier: Outperforming 85% of peers.
            </p>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="p-10 bg-slate-900 dark:bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2 uppercase tracking-tighter">Weekly Goal</h4>
                <p className="text-indigo-100/80 text-sm mb-8 font-medium">Push through 3 more modules to unlock the "Architect" badge.</p>
                <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl shadow-lg transition-transform active:scale-95">
                    RESUME PATH
                </Button>
              </div>
              <Trophy className="absolute -right-6 -bottom-6 h-40 w-40 opacity-10 -rotate-12" />
           </div>
        </div>
      </div>

      {/* --- SETTINGS DRAWER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-[#0B0F1A] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-500">
            
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Settings</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all dark:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 mx-8 mt-8 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              {["profile", "email", "password"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? "bg-white dark:bg-slate-800 shadow-md text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-500 dark:text-slate-500 opacity-60 hover:opacity-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              {activeTab === "profile" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">Identity Label</Label>
                    <Input className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none px-5 font-bold text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-500" value={formName} onChange={(e) => setFormName(e.target.value)} />
                  </div>
                  <Button 
                    disabled={nameLoading || formName.trim() === name} 
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all" 
                    onClick={() => updateName({name: formName}).then(() => setIsModalOpen(false))}
                  >
                    SYNC CHANGES
                  </Button>
                </div>
              )}

           {/* --- EMAIL TAB (REPAIRED) --- */}
{activeTab === "email" && (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
    {!isOtpSent ? (
      /* Step 1: Enter New Email */
      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">
            New Communications Address
          </Label>
          <div className="flex gap-2">
            <Input 
              className={`h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none px-5 font-bold text-slate-900 dark:text-white flex-1 ring-1 ${
                isEmailSame ? "ring-amber-500/50" : "ring-slate-200 dark:ring-slate-800"
              }`} 
              value={formEmail} 
              onChange={(e) => setFormEmail(e.target.value)} 
            />
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 px-6 font-black text-xs text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800" 
              disabled={timeLeft > 0 || otpLoading || isEmailSame || !formEmail.includes('@')} 
              onClick={async () => {
                try {
                  await requestEmailOtp({ newEmail: formEmail });
                  setIsOtpSent(true); // THIS REVEALS THE OTP INPUT
                  setTimeLeft(60); 
                  toast.success("Verification Code Dispatched");
                } catch (err) {
                  toast.error("Dispatch Failed");
                }
              }}
            >
              {otpLoading ? "..." : "VERIFY"}
            </Button>
          </div>
          {isEmailSame && (
            <p className="text-[10px] text-amber-600 font-black flex items-center gap-1.5 px-1 uppercase tracking-tighter">
              <AlertCircle className="h-3 w-3" /> Input must differ from current email.
            </p>
          )}
        </div>
      </div>
    ) : (
      /* Step 2: Enter OTP (The missing piece) */
      <div className="space-y-6 animate-in zoom-in-95">
        <div className="p-8 bg-indigo-600/5 dark:bg-indigo-500/5 border border-indigo-600/10 dark:border-indigo-500/20 rounded-[2rem] space-y-6">
          <div className="text-center space-y-2">
            <Label className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
              Security Code Sent to {formEmail}
            </Label>
            <p className="text-[10px] text-slate-500 font-bold italic">Check your inbox for the 6-digit key.</p>
          </div>
          
          <Input 
            placeholder="000000" 
            maxLength={6}
            className="h-20 text-center text-4xl tracking-[0.5em] font-black bg-white dark:bg-slate-900 border-none rounded-2xl text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-indigo-500" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
          />
          
          <div className="space-y-3">
            <Button 
              disabled={verifyLoading || otp.length < 4} 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20" 
              onClick={async () => {
                await verifyAndChangeEmail({ otp });
                setIsModalOpen(false);
                setIsOtpSent(false);
                queryClient.invalidateQueries({ queryKey: ['profile'] });
              }}
            >
              {verifyLoading ? "VERIFYING..." : "CONFIRM IDENTITY"}
            </Button>
            
            <button 
              onClick={() => setIsOtpSent(false)} 
              className="w-full text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
            >
              Change Email Address
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}
              {activeTab === "password" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-5">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">Current Secret Key</Label>
                       <Input type="password" placeholder="••••••••" className="h-14 bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 rounded-2xl px-5 font-bold text-slate-900 dark:text-white" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 ml-1">New Secure Key</Label>
                       <Input type="password" placeholder="Min. 8 chars" className={`h-14 bg-slate-50 dark:bg-slate-900 border-none ring-1 rounded-2xl px-5 font-bold text-slate-900 dark:text-white ${isPasswordWeak || isPasswordSame ? "ring-red-500/50" : "ring-slate-200 dark:ring-slate-800"}`} value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                       
                       {isPasswordWeak && <p className="text-[9px] text-red-500 font-black uppercase tracking-tight">Security failure: Key too short.</p>}
                       {isPasswordSame && <p className="text-[9px] text-red-500 font-black uppercase tracking-tight">Logic failure: Key must be unique.</p>}
                    </div>
                  </div>
                  <Button 
                    disabled={passwordLoading || isPasswordWeak || isPasswordSame || !passwords.current} 
                    className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-2xl transition-all" 
                    onClick={() => updatePassword({newPassword: passwords.new, password: passwords.current}).then(() => setIsModalOpen(false))}
                  >
                    REWRITE SECURITY
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