"use client";

import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { Button } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toggleSidebar } from "@/redux/slices/sidebar/sidebar.slice";
import { Menu } from "lucide-react";
import UserMenu from "../user-menu/user-menu";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((state) => state.sidebar);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side - Sidebar toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="h-9 w-9"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        {/* Right side - User menu */}
        <AuthWrapper>
          <UserMenu />
        </AuthWrapper>
      </div>
    </header>
  );
}