import { User, Calendar, Trophy, Settings } from "lucide-react";

export const learnerSidebarLinks = [
  { label: "My Profile", path: "/learner/profile", icon: <User className="h-4 w-4" /> },
  {
    label: "My Bookings",
    path: "/learner/profile/bookings",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    label: "LeaderBoard",
    path: "/learner/profile/leaderboard",
    icon: <Trophy className="h-4 w-4" />,
  },
  { label: "Settings", path: "/learner/profile/settings", icon: <Settings className="h-4 w-4" /> },
];
