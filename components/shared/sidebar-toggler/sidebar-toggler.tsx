"use client";
import { Button } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { toggleSidebar } from "@/redux/slices/sidebar/sidebar.slice";

import { PanelLeftClose } from "lucide-react";

export default function SidebarToggler() {
  const dispatch = useAppDispatch();
  const SidebarToggleState = useAppSelector(
    (state) => state.sidebar.isSidebarOpen
  );

  return (
    <div>
      <Button
        variant="outline"
        className="px-2 hidden md:block border-none bg-transparent cursor-pointer text-muted-foreground -rotate-180"
        onClick={() => dispatch(toggleSidebar())}
      >
        <PanelLeftClose
          size={22}
          className={`transform  duration-500 ease-in ${
            SidebarToggleState && "-rotate-180"
          }`}
        />
      </Button>
    </div>
  );
}
