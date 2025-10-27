import { useState, useEffect } from "react";
import { useGetDashboard } from "@/hooks/profesional/useGetDashboard";
import { Processing } from "./Processing";
import { Rejected } from "./Rejected";
import {
  Bell,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Calendar,
  History,
  DollarSign,
  Settings,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { React } from "react";
import Verification from "./Verification";
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Courses", icon: BookOpen },
  { name: "Session Requests", icon: Calendar },
  { name: "My Schedule", icon: Calendar },
  { name: "Session History", icon: History },
  { name: "Earnings", icon: DollarSign },
  { name: "Profile Settings", icon: Settings },
];

export default function ProfesionalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: userData, isLoading, isError, error } = useGetDashboard();
  if (userData?.status === "processing") return <Processing />;
  if (userData?.status === "rejected")
    return <Rejected reason={userData.rejectReason || "No reason Provided Check Your Email"} />;
  if (userData?.status === "pending") return <Verification />;
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="p-4 font-bold text-lg">My App</div>
        <nav className="flex flex-col gap-2 px-2">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white shadow-lg p-4 flex flex-col">
            <button className="self-end mb-4" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notification */}
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </div>

            {/* Profile */}
            <Avatar className="w-9 h-9 cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/300" alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">
          <h1 className="text-xl font-semibold">Welcome {userData?.user.name} </h1>
        </main>
      </div>
    </div>
  );
}
