import { useRef } from "react";
import { Calendar, Trophy, Clock, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import profilePicture from "@/assets/profile.jpg";
import EditProfileDialog from "@/components/EditProfile";
import { useUpdateAvatar } from "@/hooks/learner/profile/useUpdateAvatar";
import { useUpdatePassword } from "@/hooks/learner/profile/useUpdatePassword";
import { useGetProfile } from "@/hooks/learner/profile/useGetProfile";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdatName } from "@/hooks/learner/profile/useUpdateName";
import { useRequestEmailChangeOtp } from "@/hooks/learner/profile/useRequestEmailChangeOtp";
import { useResendEmailChangeOtp } from "@/hooks/learner/profile/useResendEmailChangeOtp";
import { useVerifyAndUpdateEmail } from "@/hooks/learner/profile/useVerifyAndUpdateEmail";

interface Stats {
  hoursLearned: number;
  certificatesEarned: number;
  rank: string;
}

interface SkillProgress {
  [skill: string]: number;
}

export default function LearnerProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { data: userData, isLoading, isError, error } = useGetProfile();
  console.log(userData);
  const { mutateAsync: updateAvatar } = useUpdateAvatar();
  const { mutateAsync: updatePassword } = useUpdatePassword();
  const { mutateAsync: requestEmailChangeOtp } = useRequestEmailChangeOtp();
  const { getResendEmailChangeOtp } = useResendEmailChangeOtp();
  const { mutateAsync: verifyAndChangeEmail } = useVerifyAndUpdateEmail();
  const { mutateAsync: updateName } = useUpdatName();

  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Error loading profile: {(error as any)?.message}</p>;

  const {
    name = "Guest",
    email = "-",
    profileImg = profilePicture,
    hasPassword = false,
    lastLogin = "-",
    streak = 1,
  } = userData || {};

  const stats: Stats = {
    hoursLearned: 0,
    certificatesEarned: 0,
    rank: "-",
  };

  const skillProgress = {};
  const completedCourses = 0;
  const totalCourses = 1;
  const joinDate = "-";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    try {
      await updateAvatar(file, {
        onSuccess: () => {
          queryClient.setQueryData(["profile"], (oldData: any) => ({
            ...oldData,
            profileImg: previewUrl,
          }));
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update avatar");
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleUpdateName = async (data: { name: string }) => {
    try {
      let res = await updateName(data);
      console.log(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const requestEmailChange = async (data: { newEmail: string }) => {
    let res = await requestEmailChangeOtp(data);
  };

  const requestResendEmailOtp = async () => {
    let res = await getResendEmailChangeOtp();
  };

  const verifyOtp = async (data: { otp: string }) => {
    let res = await verifyAndChangeEmail(data);
  };

  // ✅ Logout logic
  const handleLogout = () => {};

 return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
              <AvatarImage src={profileImg} alt={name} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-3xl font-bold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <Camera className="h-6 w-6" />
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            <Badge className="absolute -top-2 -right-2 bg-orange-500 hover:bg-orange-600 border-2 border-white">
               🔥 {streak} Day Streak
            </Badge>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{name}</h1>
            <p className="text-slate-500 font-medium">{email}</p>
            <div className="flex gap-4 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {joinDate}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Active {lastLogin}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <EditProfileDialog
            userData={{ name, email, hasPassword }}
            onUpdateProfile={handleUpdateName}
            onUpdateEmail={requestEmailChange}
            onResendOtp={requestResendEmailOtp}
            onVerifyOtp={verifyOtp}
            onUpdatePassword={updatePassword}
          />
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Hours Learned", value: `${stats.hoursLearned}h`, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Certificates", value: stats.certificatesEarned, icon: Trophy, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Global Rank", value: stats.rank, icon: Badge, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-slate-900">Overall Completion</h3>
                    <p className="text-sm text-slate-500">{completedCourses} of {totalCourses} courses finished</p>
                  </div>
                  <span className="text-2xl font-black text-indigo-600">
                    {Math.round((completedCourses / totalCourses) * 100)}%
                  </span>
               </div>
               <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(completedCourses / totalCourses) * 100}%` }} 
                  />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["Web Developer", "Data Analyst", "Designer"].map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-colors cursor-default">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
