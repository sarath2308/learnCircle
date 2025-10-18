import { useState, useRef, useEffect } from "react";
import { Calendar, Trophy, Clock, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import profilePicture from "@/assets/profile.jpg";
import EditProfileDialog from "@/components/EditProfile";
import { useUpdateAvatar } from "@/hooks/learner/profile/useUpdateAvatar";
import { useUpdatProfile } from "@/hooks/learner/profile/useUpdateProfile";
import toast from "react-hot-toast";
import { useGetProfile } from "@/hooks/learner/profile/useGetProfile";
import { React } from "react";

export default function LearnerProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: updateAvatar } = useUpdateAvatar();
  const { mutateAsync: updateProfile } = useUpdatProfile();
  const { data: userData, isLoading, isError, error } = useGetProfile();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImg: profilePicture,
    hasPassword: false,
    lastLogin: "",
  });

  useEffect(() => {
    if (userData) {
      setProfile({
        name: userData.name ?? "Guest",
        email: userData.email ?? "-",
        profileImg: userData.profileImg ?? profilePicture,
        hasPassword: userData.hasPassword ?? false,
        lastLogin: userData.lastLogin ?? "",
      });
    }
  }, [userData]);

  // Loading / error state
  if (isLoading) return <p>Loading profile...</p>;
  if (isError) return <p>Error loading profile: {(error as any)?.message}</p>;

  const { name, email, profileImg, hasPassword, lastLogin } = profile;
  const streak = 0;
  const joinDate = "-";
  const stats = { hoursLearned: 0, certificatesEarned: 0, rank: "-" };
  const skillProgress = {};
  const completedCourses = 0;
  const totalCourses = 1;

  const getInitials = (name: string | undefined) => {
    if (!name || typeof name !== "string") return "G";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.warning("Only image files are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File size should not exceed 5MB.");
        return;
      }

      try {
        const previewUrl = URL.createObjectURL(file);
        await updateAvatar(file);
        setProfile((prev) => ({ ...prev, profileImg: previewUrl }));
      } catch (err) {
        console.error(err);
        toast.error("Failed to update avatar");
      }
    }
  };
  const handleUpdateProfile = async (data: { name: string }) => {
    try {
      const res = await updateProfile(data); // res here is NOT the name, it's the whole mutation result
      if (res?.user?.name) {
        setProfile((prev) => ({ ...prev, name: res.user.name }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleVerifyOtp = async () => {};
  const handleUpdateEmail = async () => {};
  const handleResendOtp = async () => {};
  const handleUpdatePassword = async () => {};

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
                userData={{
                  name: profile.name,
                  email: profile.email,
                  hasPassword: profile.hasPassword,
                }}
                onUpdateProfile={handleUpdateProfile}
                onUpdateEmail={handleUpdateEmail}
                onVerifyOtp={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                onUpdatePassword={handleUpdatePassword}
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
        {/* Hours Learned */}
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Hours Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.hoursLearned}h
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+12h this week</p>
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
              {stats.certificatesEarned}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">2 in progress</p>
          </CardContent>
        </Card>

        {/* Global Rank */}
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500 dark:text-green-400">
              {stats.rank}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Top 5% learners</p>
          </CardContent>
        </Card>
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
                    <span>{value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
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
                    style={{
                      width: `${(completedCourses / totalCourses) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completedCourses} of {totalCourses} courses completed
              </p>

              <div className="pt-4 flex flex-wrap gap-2">
                <Badge className="bg-blue-500 text-white px-2 py-1 rounded-full">
                  Web Developer
                </Badge>
                <Badge className="border border-gray-400 text-gray-500 px-2 py-1 rounded-full">
                  Data Analyst
                </Badge>
                <Badge className="border border-gray-400 text-gray-500 px-2 py-1 rounded-full">
                  Designer
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
