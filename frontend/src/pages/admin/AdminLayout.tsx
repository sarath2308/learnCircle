import { SidebarLayout } from "@/components/SidebarLayout";
import {
  IconBrandTabler,
  IconUsers,
  IconBook,
  IconFolder,
  IconChartBar,
  IconCalendar,
  IconCreditCard,
  IconMessageCircle,
  IconArrowLeft,
  IconAnalyze,

} from "@tabler/icons-react";
import { Outlet } from "react-router-dom";

export default function AdminLayoutWrapper() {
  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <IconBrandTabler className="h-5 w-5" /> },
    { label: "Users", path: "/admin/users", icon: <IconUsers className="h-5 w-5" /> },
    { label: "Courses", path: "/admin/courses", icon: <IconBook className="h-5 w-5" /> },
    { label: "Resources", path: "/admin/resources", icon: <IconFolder className="h-5 w-5" /> },
    {
      label: "Category Management",
      path: "/admin/category",
      isCategory: true,
      icon: <IconAnalyze className="h-5 w-5" />,
    },
    { label: "Reports", path: "/admin/reports", icon: <IconChartBar className="h-5 w-5" /> },
    { label: "Sessions", path: "/admin/sessions", icon: <IconCalendar className="h-5 w-5" /> },
    { label: "Payments", path: "/admin/payments", icon: <IconCreditCard className="h-5 w-5" /> },
    { label: "Reviews", path: "/admin/reviews", icon: <IconMessageCircle className="h-5 w-5" /> },
    { label: "Category", path: "/admin/category", icon: <IconAnalyze className="h-5 w-5" /> },
    { label: "Logout", path: "/logout", icon: <IconArrowLeft className="h-5 w-5" /> },
  ];

  const adminUser = {
    name: "Admin User",
    avatar: "https://assets.aceternity.com/manu.png",
    profilePath: "/admin/profile",
  };

  return (
    <SidebarLayout links={adminLinks} user={adminUser} logoText="LearnCircle">
      <Outlet />
    </SidebarLayout>
  );
}
