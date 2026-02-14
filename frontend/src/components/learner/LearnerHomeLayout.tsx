"use client";

import { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  ShoppingBag, Menu, X, BookOpen, Sun, Moon, 
  Video, Bell, Calendar, Info, ChevronRight, Zap 
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { RootState } from "@/redux/store";

export default function LearnerHomeLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Courses", path: "/learner/courses", icon: BookOpen },
    { name: "Events", path: "/learner/events", icon: Calendar },
    { name: "Professionals", path: "/learner/professionals", icon: Video },
    { name: "About", path: "/learner/about", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-slate-900 dark:text-slate-50 transition-colors duration-500 font-sans antialiased">
      
      {/* --- FLOATING ELITE NAVBAR --- */}
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-700 ease-in-out px-4 md:px-8 ${
          isScrolled ? "pt-4" : "pt-6"
        }`}
      >
        <div 
          className={`container mx-auto transition-all duration-500 rounded-[2rem] flex items-center justify-between px-6 ${
            isScrolled 
            ? "h-16 bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5" 
            : "h-20 bg-transparent border-transparent"
          }`}
        >
          {/* Brand - Minimalist & Sharp */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative h-10 w-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-2xl">
                <Zap size={20} fill="currentColor" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight uppercase hidden sm:block">
              learn<span className="text-indigo-600">Circle</span>
            </span>
          </div>

          {/* Desktop Navigation - "Pill" Style */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                    isActive 
                      ? "text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`
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
              <Button variant="ghost" size="icon" className="hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors group">
                <Video size={18} className="group-hover:text-indigo-600 transition-colors" />
              </Button>
              
              <Button variant="ghost" size="icon" className="relative hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full transition-colors group">
                <Bell size={18} className="group-hover:text-rose-600 transition-colors" />
                <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-rose-600 rounded-full ring-2 ring-white dark:ring-black" />
              </Button>

              <Button variant="ghost" size="icon" className="relative hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-full transition-colors group">
                <ShoppingBag size={18} className="group-hover:text-amber-600 transition-colors" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black text-[9px] font-black border-none">
                  3
                </Badge>
              </Button>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block" />

            {/* Profile & Theme Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
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

      {/* --- MOBILE SIDEBAR (Drawer) --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white dark:bg-[#0A0A0A] p-10 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-12">
              <span className="font-black tracking-[0.3em] text-[10px] opacity-40 uppercase">Navigation</span>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsMenuOpen(false)}><X /></Button>
            </div>
            
            <nav className="space-y-6 flex-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-2 text-xl font-black transition-all ${
                      isActive ? "text-indigo-600 translate-x-2" : "text-slate-400"
                    }`
                  }
                >
                  {link.name} <ChevronRight size={18} className={isActive ? "opacity-100" : "opacity-0"} />
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* --- CONTENT AREA --- */}
      <main className="flex-1">
        {/* pt-32 ensures content starts below the floating nav */}
        <div className="container mx-auto px-6 pt-32 pb-20 lg:pt-40 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <Outlet />
        </div>
      </main>

      {/* --- FOOTER (Minimalist & Clean) --- */}
      <footer className="py-20 bg-transparent relative overflow-hidden">
        <div className="container mx-auto px-6 border-t border-slate-100 dark:border-white/5 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
              <span className="text-2xl font-black tracking-tighter">learnCircle</span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">The Future of Continuous Mastery</p>
            </div>
            
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors">Network</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Systems</a>
            </div>
          </div>
          <p className="text-center text-[9px] text-slate-300 dark:text-slate-800 font-bold mt-16 uppercase tracking-[0.5em]">
            Digital Environment © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}