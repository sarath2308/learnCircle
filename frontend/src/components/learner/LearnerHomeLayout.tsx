"use client";

import { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, ShoppingBag, Menu, X, BookOpen, Sun, Moon, Command } from "lucide-react";
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

  // Sync scroll for the glass effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020817] flex flex-col">
      {/* --- PREMIUM NAVBAR --- */}
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          isScrolled
            ? "h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b shadow-sm"
            : "h-20 bg-transparent"
        }`}
      >
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            onClick={() => navigate("/")}
          >
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">
              learn<span className="text-blue-600">Circle</span>
            </span>
          </div>

          {/* Center Search (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative group">
            <Search
              className="absolute left-3 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full h-10 pl-10 pr-4 bg-slate-100 dark:bg-slate-900 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
            />
            <div className="absolute right-3 hidden lg:flex items-center gap-1 opacity-50">
              <Command size={12} />
              <span className="text-[10px] font-bold">K</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden lg:flex items-center gap-6 mr-4">
              {["Courses", "Professionals", "Enterprise"].map((item) => (
                <NavLink
                  key={item}
                  to={`/learner/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `text-sm font-bold tracking-tight transition-colors ${
                      isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}
            </nav>

            <Button variant="ghost" size="icon" className="relative rounded-full">
              <ShoppingBag size={20} />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-600">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hidden sm:flex"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <Avatar
              className="h-9 w-9 cursor-pointer ring-offset-2 hover:ring-2 ring-blue-600 transition-all"
              onClick={() => navigate("/learner/profile")}
            >
              <AvatarImage src={currentUser?.profileImg} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                {currentUser?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC CONTENT --- */}
      <main className="flex-1 flex flex-col">
        {/* pt-20 matches the navbar height to prevent overlap */}
        <div className="container mx-auto px-6 pt-24 pb-12 lg:pt-32">
          <Outlet />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-lg font-black tracking-tighter">learnCircle</span>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-blue-600">
              About
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-600">
              Terms
            </a>
            <a href="#" className="hover:text-blue-600">
              Help
            </a>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © 2026 learnCircle. Built for the future of learning.
          </p>
        </div>
      </footer>
    </div>
  );
}
