"use client";

import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  User,
  Calendar,
  Settings,
  LogOut,
  Briefcase,
  ChevronRight,
  AlertTriangle,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useLearnerLogout } from "@/hooks/learner/profile/useLearnerLogout";
import { Button } from "@/components/ui/button";

const LearnerProfileLayout: React.FC = () => {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const { mutateAsync: logout, isPending: logoutLoading } = useLearnerLogout();

  // State for Logout Confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { path: "", label: "Profile", icon: <User size={18} /> },
    { path: "bookings", label: "Bookings", icon: <Calendar size={18} /> },
    { path: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020817] transition-colors duration-300">
      <div className="mx-auto max-w-7xl p-4 md:p-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- SIDEBAR --- */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <div className="mb-10 flex items-center lg:flex-col lg:text-center gap-4">
                <div className="relative h-20 w-20 lg:h-28 lg:w-28 shrink-0">
                  <img
                    src={
                      user?.profileImg || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    }
                    alt="User"
                    className="h-full w-full rounded-3xl bg-slate-100 dark:bg-slate-800 object-cover shadow-inner border-4 border-white dark:border-slate-800"
                  />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-white dark:border-slate-900 bg-emerald-500 shadow-sm" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white lg:mt-3 tracking-tight">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                    Verified Access
                  </p>
                </div>
              </div>

              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {navItems.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.path}
                    end={item.path === ""}
                    className={({ isActive }) => `
                      flex flex-1 lg:w-full items-center justify-center lg:justify-start gap-3 rounded-2xl px-5 py-3.5 transition-all
                      ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="font-black text-xs uppercase tracking-widest whitespace-nowrap">
                      {item.label}
                    </span>
                  </NavLink>
                ))}

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex lg:hidden items-center justify-center p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl"
                >
                  <LogOut size={18} />
                </button>
              </nav>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="hidden lg:flex w-full items-center gap-3 mt-10 px-5 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all font-black text-xs uppercase tracking-widest group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Terminate Session</span>
              </button>
            </div>
          </aside>

          {/* --- CONTENT AREA --- */}
          <div className="flex flex-1 flex-col gap-8">
            <main className="rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 shadow-sm min-h-[500px]">
              <Outlet />
            </main>

            <section className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-indigo-600 p-10 text-white shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10">
                    <Briefcase size={32} />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-2xl font-black uppercase tracking-tighter">
                      Monetize Expertise
                    </h4>
                    <p className="text-indigo-100/60 text-sm font-medium">
                      Elevate from learner to professional and scale your impact.
                    </p>
                  </div>
                </div>
                <Button className="h-14 px-8 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-black/20 group">
                  Apply Now{" "}
                  <ChevronRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          />

          <div className="relative w-full max-w-sm bg-white dark:bg-[#0B0F1A] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                Terminate Session?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">
                You are about to exit your learning environment. Unsaved progress may be lost.
              </p>

              <div className="flex flex-col w-full gap-3">
                <Button
                  disabled={logoutLoading}
                  onClick={handleLogout}
                  className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-rose-600/20"
                >
                  {logoutLoading ? "PROCESSING..." : "YES, LOGOUT"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full h-14 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerProfileLayout;
