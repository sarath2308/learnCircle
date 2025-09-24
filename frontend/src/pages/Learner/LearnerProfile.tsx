import { useState, useRef } from "react";
import { Calendar, Trophy, Clock, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import profilePicture from "@/assets/profile.jpg";
import EditProfileDialog from "@/components/EditProfile";
import { useUpdateAvatar } from "@/hooks/learner/useUpdateAvatar";


export default function LearnerProfile() {
  const [profilePic, setProfilePic] = useState(profilePicture);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {mutateAsync,isPending}=useUpdateAvatar()
  

  const [userData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    joinDate: "January 2024",
    lastLogin: "2 hours ago",
    streak: 15,
    totalCourses: 12,
    completedCourses: 8,
    skillProgress: {
      "Web Development": 85,
      "Data Science": 60,
      "UI/UX Design": 45,
      "Project Management": 75,
    },
    stats: {
      hoursLearned: 156,
      certificatesEarned: 5,
      rank: "#23",
    },
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await mutateAsync(file);
      
    }
  };
 const handleUpdateProfile=()=>
 {
  
 }
  return (
    <div className="space-y-6 p-4">
      {/* Profile Header */}
      <Card className="shadow-md rounded-xl">
        <CardContent className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePic} alt={userData.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>

            {/* Streak Badge */}
            <Badge className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {userData.streak} day streak
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
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.name}
              </h1>
                <EditProfileDialog 
                  userData={userData}
                  onUpdateProfile={handleUpdateProfile}
                />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {userData.email}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {userData.joinDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Last login: {userData.lastLogin}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Hours Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {userData.stats.hoursLearned}h
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +12h this week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
              {userData.stats.certificatesEarned}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              2 in progress
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Global Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500 dark:text-green-400">
              {userData.stats.rank}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Top 5% learners
            </p>
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
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Skill Development
              </h3>
              {Object.entries(userData.skillProgress).map(([skill, value]) => (
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
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Course Completion
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Overall Progress</span>
                  <span>
                    {Math.round(
                      (userData.completedCourses / userData.totalCourses) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (userData.completedCourses / userData.totalCourses) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userData.completedCourses} of {userData.totalCourses} courses
                completed
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
