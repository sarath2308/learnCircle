"use client";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useGetDashboard } from "@/hooks/profesional/useGetDashboard";
import { Processing } from "./Processing";
import { Rejected } from "./Rejected";
import Verification from "./Verification";

import { Bell, Menu, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  IconBook,
  IconBrandTabler,
  IconCalendar,
  IconChartBar,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useProfessionalLogout } from "@/hooks/profesional/professional-profile/professional.profile.logout.hook";

const adminLinks = [
  { label: "Dashboard", path: "/professional/home", icon: IconBrandTabler },
  { label: "Courses", path: "/professional/my-courses", icon: IconBook },
  { label: "Sessions", path: "/professional/sessions", icon: IconChartBar },
  { label: "Schedule", path: "/professional/schedule", icon: IconCalendar },
  // { label: "Earnings", path: "/professional/payments", icon: IconCreditCard },
  { label: "Chat", path: "/professional/chat", icon: IconMessageCircle },
  // { label: "Reviews", path: "/professional/reviews", icon: IconMessageCircle },
  // { label: "Settings", path: "/professional/settings", icon: IconSettings },
];

export default function ProfesionalLayout() {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);
  const { data: userData, isLoading } = useGetDashboard();
  const logoutMutation = useProfessionalLogout();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (userData?.status === "processing") return <Processing />;
  if (userData?.status === "rejected")
    return <Rejected reason={userData.rejectReason || "No reason Provided"} />;
  if (userData?.status === "pending") return <Verification />;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const NavItems = () => (
    <>
      {adminLinks.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900"
            }
          `}
        >
          <item.icon size={20} />
          {item.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xl font-black tracking-tighter text-blue-600">learnCircle.</span>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-600 uppercase">
            Pro
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItems />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 font-bold rounded-xl"
          >
            <LogOut size={20} /> Logout
          </Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 md:pl-64 flex flex-col">
        {/* TOP HEADER */}
        <header className="h-16 sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Nav Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <div className="p-6 border-b font-black text-xl text-blue-600">learnCircle</div>
                <nav className="p-4 space-y-1">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>

            <h2 className="hidden sm:block text-sm font-bold text-slate-400">
              Welcome back, {currentUser?.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-slate-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </Button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold leading-none">{userData?.user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Instructor</p>
              </div>
              <Avatar
                onClick={() => navigate("/professional/profile")}
                className="h-9 w-9 border-2 border-blue-600/10"
              >
                <AvatarImage
                  src={
                    currentUser?.profileImg ??
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                  {userData?.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet /> {/* CRITICAL: This renders the dashboard, courses, etc. */}
        </main>
      </div>
    </div>
  );
}
