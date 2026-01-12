"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react"; // assuming you use lucide
// if not, replace with your icons

interface SidebarLinkItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarLayoutProps {
  links: SidebarLinkItem[];
  user?: {
    name: string;
    avatar?: string;
    profilePath?: string;
  };
  logoText?: string;
  children: React.ReactNode;
}

export function SidebarLayout({
  links,
  user,
  logoText = "Acet Labs",
  children,
}: SidebarLayoutProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // THEME STATE
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // INIT THEME
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  // HANDLE TOGGLE
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 overflow-hidden mt-5",
      )}
    >
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 ">
          {/* TOP SECTION */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} onClick={() => navigate(link.path)} />
              ))}
            </div>
          </div>

          {/* DARK MODE TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white hover:opacity-80"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {open && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* USER */}
          {user && (
            <SidebarLink
              link={{
                label: user.name,
                href: user.profilePath || "/profile",
                icon: (
                  <img
                    src={user.avatar || "https://via.placeholder.com/40"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={40}
                    height={40}
                    alt="Avatar"
                  />
                ),
              }}
              onClick={() => navigate(user.profilePath || "/profile")}
            />
          )}
        </SidebarBody>
      </Sidebar>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 h-full w-full overflow-y-auto p-4 md:p-8 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700 rounded-tl-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}

/* -------------------------------------------
   LOGO COMPONENTS
------------------------------------------- */
const Logo = ({ text }: { text: string }) => (
  <Link
    to="/"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
  >
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre"
    >
      {text}
    </motion.span>
  </Link>
);

const LogoIcon = () => (
  <Link
    to="/"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
  >
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </Link>
);
