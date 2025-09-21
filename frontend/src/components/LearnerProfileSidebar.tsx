import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, Calendar, Trophy, Settings, LogOut } from "lucide-react";

const profileMenuItems = [
  { icon: User, label: "My Profile", path: "/profile" },
  { icon: Calendar, label: "My Bookings", path: "/profile/bookings" },
  { icon: Trophy, label: "LeaderBoard", path: "/profile/leaderboard" },
  { icon: Settings, label: "Settings", path: "/profile/settings" },
  { icon: LogOut, label: "Logout", path: "/logout" },
];

export function LearnerProfileSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 ${
                            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
