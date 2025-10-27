import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { React } from "react";
import {
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Users,
  BookOpen,
  List,
  FileText,
  BarChart2,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Subjects", icon: BookOpen, path: "/admin/subjects" },
  { name: "Steps", icon: List, path: "/admin/steps" },
  { name: "Resources", icon: FileText, path: "/admin/resources" },
  { name: "Reports", icon: BarChart2, path: "/admin/reports" },
  { name: "Sessions", icon: Clock, path: "/admin/sessions" },
  { name: "Payments", icon: DollarSign, path: "/admin/payments" },
  { name: "Reviews", icon: Star, path: "/admin/reviews" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="p-4 font-bold text-lg">Admin Panel</div>
        <nav className="flex flex-col gap-2 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 transition ${
                  isActive ? "bg-gray-200 font-medium" : ""
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
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
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
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
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </div>

            <Avatar className="w-9 h-9 cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/300" alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
