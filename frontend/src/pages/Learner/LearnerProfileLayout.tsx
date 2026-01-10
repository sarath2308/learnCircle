import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarLayout } from "@/components/admin/SidebarLayout";
import { IconUser, IconCalendar, IconTrophy, IconSettings } from "@tabler/icons-react";

export default function LearnerProfileLayout() {
  const links = [
    { label: "My Profile", path: "/learner/profile", icon: <IconUser /> },
    { label: "Bookings", path: "/learner/bookings", icon: <IconCalendar /> },
    { label: "Leaderboard", path: "/learner/leaderboard", icon: <IconTrophy /> },
    { label: "Settings", path: "/learner/settings", icon: <IconSettings /> },
  ];

  const user = {
    name: "John Doe",
    avatar: "https://via.placeholder.com/40",
    profilePath: "/learner/profile",
  };

  return (
    <SidebarLayout links={links} user={user} logoText="Learner Panel">
      <Outlet />
    </SidebarLayout>
  );
}
