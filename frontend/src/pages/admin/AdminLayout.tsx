import { SidebarLayout } from "@/components/admin/SidebarLayout";
import AdminNavbar from "@/components/admin/AdminNavbar";
import {
  IconBrandTabler,
  IconUsers,
  IconBook,
  IconFolder,
  IconChartBar,
  IconCalendar,
  IconCreditCard,
  IconMessageCircle,
  IconAnalyze,
  IconAdjustmentsPin,
  IconMessage,
} from "@tabler/icons-react";
import { Outlet } from "react-router-dom";

export default function AdminLayoutWrapper() {
  const adminLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <IconBrandTabler className="h-5 w-5" /> },
    { label: "Users", path: "/admin/users", icon: <IconUsers className="h-5 w-5" /> },
    { label: "Courses", path: "/admin/courses", icon: <IconBook className="h-5 w-5" /> },
    { label: "Resources", path: "/admin/resources", icon: <IconFolder className="h-5 w-5" /> },
    { label: "Reports", path: "/admin/reports", icon: <IconChartBar className="h-5 w-5" /> },
    { label: "Sessions", path: "/admin/sessions", icon: <IconCalendar className="h-5 w-5" /> },
    { label: "Payments", path: "/admin/payments", icon: <IconCreditCard className="h-5 w-5" /> },
    { label: "Reviews", path: "/admin/reviews", icon: <IconMessageCircle className="h-5 w-5" /> },
    { label: "Category", path: "/admin/category", icon: <IconAnalyze className="h-5 w-5" /> },
    {
      label: "My Courses",
      path: "/admin/my-courses",
      icon: <IconAdjustmentsPin className="h-5 w-5" />,
    },
    { label: "Chat", path: "/admin/chat", icon: <IconMessage className="h-5 w-5" /> },
  ];

  const logout = () => {
    // clear auth token
    // navigate("/login")
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar adminName="Admin User" onLogout={logout} />

      <div className="flex pt-14">
        <SidebarLayout links={adminLinks}>
          <Outlet />
        </SidebarLayout>
      </div>
    </div>
  );
}
