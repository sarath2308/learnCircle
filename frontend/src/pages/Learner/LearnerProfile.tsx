import { useState } from "react";
import { Calendar, Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ProgressBar";
// import EditProfileDialog from "@/components/EditProfileDialog";
import profilePicture from "@/assets/profile.jpg";

export default function LearnerProfile() {
  const [userData, setUserData] = useState({
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

  const [profileImage, setProfileImage] = useState(profilePicture);

  const handleUpdateProfile = (data: { name: string; email: string; profileImage?: string }) => {
    setUserData((prev) => ({
      ...prev,
      name: data.name,
      email: data.email,
    }));

    // Always update profile image if provided
    if (data.profileImage) {
      setProfileImage(data.profileImage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="shadow-medium">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileImage} alt={userData.name} />
                <AvatarFallback className="text-2xl">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Badge
                variant="secondary"
                className="absolute -bottom-2 -right-2 bg-success text-white"
              >
                {userData.streak} day streak
              </Badge>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">{userData.name}</h1>
                {/* <EditProfileDialog 
                  userData={userData}
                  profileImage={profileImage}
                  onUpdateProfile={handleUpdateProfile}
                /> */}
              </div>
              <p className="text-muted-foreground">{userData.email}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {userData.joinDate}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Last login: {userData.lastLogin}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hours Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{userData.stats.hoursLearned}h</div>
            <p className="text-xs text-muted-foreground">+12h this week</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {userData.stats.certificatesEarned}
            </div>
            <p className="text-xs text-muted-foreground">2 in progress</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{userData.stats.rank}</div>
            <p className="text-xs text-muted-foreground">Top 5% learners</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-primary" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Skill Development</h3>
              {Object.entries(userData.skillProgress).map(([skill, progress]) => (
                <ProgressBar key={skill} label={skill} value={progress} className="space-y-1" />
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Course Completion</h3>
              <ProgressBar
                label="Overall Progress"
                value={userData.completedCourses}
                max={userData.totalCourses}
                showPercentage={false}
                className="space-y-1"
              />
              <p className="text-sm text-muted-foreground">
                {userData.completedCourses} of {userData.totalCourses} courses completed
              </p>

              <div className="pt-4 space-y-2">
                <Badge variant="secondary" className="mr-2">
                  Web Developer
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Data Analyst
                </Badge>
                <Badge variant="outline">Designer</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
