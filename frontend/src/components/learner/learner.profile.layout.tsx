import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { User, Calendar, Settings, LogOut, Briefcase, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const LearnerProfileLayout: React.FC = () => {
  const user = useSelector((state: RootState) => state.currentUser.currentUser);
  const navItems = [
    { path: "", label: "Profile", icon: <User size={18} /> },
    { path: "bookings", label: "Bookings", icon: <Calendar size={18} /> },
    { path: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl p-4 md:p-10">
        {/* MAIN CONTAINER */}
        <div className="flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* SIDEBAR - Responsive: Column on Large, Row on Small */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 shadow-sm">
              {/* User Identity */}
              <div className="mb-8 flex items-center lg:flex-col lg:text-center gap-4">
                <div className="relative h-16 w-16 lg:h-24 lg:w-24 shrink-0">
                  <img
                    src={
                      user?.profileImg || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    }
                    alt="User"
                    className="rounded-2xl bg-blue-50 dark:bg-slate-800 object-cover shadow-inner"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white lg:mt-2">
                    {user?.name || "John Doe"}
                  </h2>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                    Verified Member
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {navItems.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.path}
                    end={item.path === ""}
                    className={({ isActive }) => `
    flex flex-1 lg:w-full items-center justify-center lg:justify-start gap-3 rounded-xl px-4 py-3 transition-all
    ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
        : "text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
    }
  `}
                  >
                    {item.icon}
                    <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                  </NavLink>
                ))}

                {/* Mobile Logout Button (Icon Only or Small) */}
                <button className="flex lg:hidden items-center justify-center p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                  <LogOut size={18} />
                </button>
              </nav>

              {/* Desktop Logout */}
              <button className="hidden lg:flex w-full items-center gap-3 mt-8 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                <LogOut size={18} />
                <span className="font-semibold text-sm">Logout</span>
              </button>
            </div>
          </aside>

          {/* RIGHT SIDE CONTENT */}
          <div className="flex flex-1 flex-col gap-6">
            {/* DYNAMIC CONTENT AREA */}
            <main className="rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 md:p-10 shadow-sm min-h-[400px]">
              <Outlet />
            </main>

            {/* LOWER SECTION: CTA */}
            <section className="relative group overflow-hidden rounded-3xl bg-slate-900 dark:bg-blue-600 p-8 text-white shadow-xl transition-all hover:shadow-2xl">
              {/* Background Animation */}
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 animate-pulse rounded-full bg-white/10 blur-3xl transition-transform group-hover:scale-150"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <Briefcase size={28} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Register as a Professional</h4>
                    <p className="text-blue-100/70 dark:text-blue-50/80 text-sm">
                      Join our network and start getting paid for your skills.
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition-all hover:gap-4 active:scale-95">
                  Get Started <ChevronRight size={18} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerProfileLayout;
