"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface AdminNavbarProps {
  adminName: string;
  onLogout: () => void;
}

function AdminNavbar({ adminName, onLogout }: AdminNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background flex items-center justify-between px-6 bg-gray-100 dark:bg-neutral-800 overflow-hidden">
      <span className="text-lg font-semibold">LearnCircle</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{adminName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm">{adminName}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Admin</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
export default AdminNavbar;
