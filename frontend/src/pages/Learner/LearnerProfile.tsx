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
import { React } from "react";
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
          // Update React Query cache instead of local state
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

  return (
    <div className="space-y-6 p-4">
      {/* Profile Header */}
      <Card className="shadow-md rounded-xl">
        <CardContent className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImg} alt={name} />
              <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
            </Avatar>

            {/* Streak Badge */}
            <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {streak} day streak
            </Badge>

            {/* Change Picture Button */}
            <button
              type="button"
              aria-label="Change Profile Picture"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 flex items-center justify-center 
                         bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 
                         transition-opacity"
            >
              <Camera className="h-4 w-4" />
            </button>

            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <EditProfileDialog
                userData={{ name, email, hasPassword }}
                onUpdateProfile={handleUpdateName}
                onUpdateEmail={requestEmailChange}
                onResendOtp={requestResendEmailOtp}
                onVerifyOtp={verifyOtp}
                onUpdatePassword={updatePassword}
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400">{email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Last login: {lastLogin}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Hours Learned",
            value: `${stats.hoursLearned}h`,
            note: "+12h this week",
            color: "blue-600",
          },
          {
            title: "Certificates",
            value: stats.certificatesEarned,
            note: "2 in progress",
            color: "yellow-500",
          },
          { title: "Global Rank", value: stats.rank, note: "Top 5% learners", color: "green-500" },
        ].map((stat) => (
          <Card key={stat.title} className="shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold text-${stat.color} dark:text-${stat.color}-400`}>
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Progress */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            <span>Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Progress */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Skill Development</h3>
              {Object.entries(skillProgress).map(([skill, value]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{skill}</span>
                    <span>4%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Course Completion */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Course Completion</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Overall Progress</span>
                  <span>{Math.round((completedCourses / totalCourses) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(completedCourses / totalCourses) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completedCourses} of {totalCourses} courses completed
              </p>

              <div className="pt-4 flex flex-wrap gap-2">
                {["Web Developer", "Data Analyst", "Designer"].map((skill) => (
                  <Badge
                    key={skill}
                    className={
                      skill === "Web Developer"
                        ? "bg-blue-500 text-white"
                        : "border border-gray-400 text-gray-500"
                    }
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
