"use client";

import { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  BookOpen,
  Sun,
  Moon,
  Video,
  Bell,
  Calendar,
  Info,
  ChevronRight,
  Zap,
  Home,
  CheckCheck,
  Inbox,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { RootState } from "@/redux/store";
import { useTheme } from "@/context/theme.context";
import Chatbot from "../shared/chatbot.component";
import { useGetNotification } from "@/hooks/shared/notification/notification.get.hook";
import { useNotificationMarkAsRead } from "@/hooks/shared/notification/notification.mark.hook";
import { getSocket } from "@/socket/socket";

export default function LearnerHomeLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // API Hooks
  const { data: notificationRes, refetch: refetchNotification } = useGetNotification();
  const markAsReadMutation = useNotificationMarkAsRead();

  // Logic: Only show notifications that are unread (assuming your backend doesn't filter them already)
  const notifications = notificationRes?.notificationData || [];
  const unreadCount = notifications.length;

  const handleReadAllNotification = async () => {
    await markAsReadMutation.mutateAsync();
    refetchNotification();
  };

  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    const handleNotification = () => {
      console.log("event reached frontend--------------------------");
      // Refetch when a new notification hits via socket
      refetchNotification();
    };

    socket.on("notification", handleNotification);
    socket.emit("join");
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [refetchNotification]);

  const navLinks = [
    { name: "Home", path: "/learner/home", icon: Home },
    { name: "Courses", path: "/learner/courses", icon: BookOpen },
    { name: "Events", path: "/learner/events", icon: Calendar },
    { name: "Professionals", path: "/learner/professionals", icon: Video },
    { name: "About", path: "/learner/about", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-slate-900 dark:text-slate-50 transition-colors duration-500 font-sans antialiased">
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-700 ease-in-out px-4 md:px-8 ${isScrolled ? "pt-4" : "pt-6"}`}
      >
        <div
          className={`container mx-auto transition-all duration-500 rounded-[2rem] flex items-center justify-between px-6 ${isScrolled ? "h-16 bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-xl border border-white/20 dark:border-white/5" : "h-20 bg-transparent"}`}
        >
          {/* Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/learner/home")}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500" />
              <div className="relative h-10 w-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-2xl">
                <Zap size={20} fill="currentColor" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight uppercase hidden sm:block">
              learn<span className="text-indigo-600">Circle</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 bg-indigo-600 rounded-full animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Utility Hub */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              <Button
                onClick={() => navigate("/learner/random-match")}
                variant="ghost"
                size="icon"
                className="hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full group"
              >
                <Video size={18} className="group-hover:text-indigo-600 transition-colors" />
              </Button>

              {/* NOTIFICATION POPOVER */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full group"
                  >
                    <Bell size={18} className="group-hover:text-rose-600 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-black animate-in zoom-in">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-0 bg-white dark:bg-[#0F1117] border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl mt-4 overflow-hidden"
                  align="end"
                >
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Center Hub
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleReadAllNotification}
                        className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase hover:opacity-70 transition-opacity"
                      >
                        <CheckCheck size={12} /> Mark All
                      </button>
                    )}
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n: any, i: number) => (
                        <div
                          key={i}
                          className="p-5 border-b border-slate-50 dark:border-slate-800/50 last:border-none hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <p className="text-xs font-black uppercase text-indigo-600 mb-1">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <Inbox className="mx-auto h-8 w-8 text-slate-200 dark:text-slate-800 mb-3" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          No New Alerts
                        </p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block" />

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-indigo-600" />
                )}
              </button>

              <Avatar
                className="h-10 w-10 cursor-pointer border-2 border-transparent hover:border-indigo-600 transition-all active:scale-90"
                onClick={() => navigate("/learner/profile")}
              >
                <AvatarImage src={currentUser?.profileImg} className="object-cover" />
                <AvatarFallback className="bg-slate-100 dark:bg-white/5 text-xs font-black">
                  {currentUser?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={22} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE SIDEBAR --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[10000] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white dark:bg-[#0A0A0A] p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <span className="font-black tracking-[0.3em] text-[10px] opacity-40 uppercase text-slate-500">
                Navigation
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <X />
              </Button>
            </div>
            <nav className="space-y-4 flex-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-4 rounded-2xl text-lg font-black transition-all ${isActive ? "bg-indigo-600 text-white shadow-lg translate-x-2" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"}`
                    }
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={20} />
                      {link.name}
                    </div>
                    <ChevronRight size={18} />
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="container mx-auto px-6 pt-32 pb-20 lg:pt-40 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <Outlet />
        </div>
      </main>

      <Chatbot />

      {/* --- FOOTER --- */}
      <footer className="py-20 bg-transparent border-t border-slate-100 dark:border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start transition-opacity hover:opacity-80">
              <NavLink
                to="/learner/home"
                className="text-2xl font-black tracking-tighter uppercase"
              >
                learn<span className="text-indigo-600">Circle</span>
              </NavLink>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-3">
                The Future of Continuous Mastery
              </p>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {[
                { name: "Network", path: "/learner/professionals" },
                { name: "Privacy", path: "/learner/privacy" },
                { name: "Support", path: "/learner/about" },
                { name: "Terms", path: "/learner/terms" },
              ].map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-[10px] font-black uppercase tracking-widest transition-all hover:text-indigo-600 ${isActive ? "text-indigo-600" : "text-slate-400"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="mt-20 flex flex-col items-center">
            <div className="h-px w-12 bg-indigo-600/30 mb-8" />
            <p className="text-[9px] text-slate-300 dark:text-slate-800 font-bold uppercase tracking-[0.5em]">
              Digital Environment © 2026 — All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
