/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useAppSelector } from "@/hooks/use-store";
import {
  AlarmClockPlus,
  BadgeInfo,
  DraftingCompass,
  LucideIcon,
  ShieldUser,
  Speech,
  WholeWord,
} from "lucide-react";
import { useState, useTransition } from "react";
import SidebarItem from "./item";
import { SidebarItemSkeleton } from "./sidebar-item-skeleton";

interface ISubItem {
  name: string;
  path: string;
}

interface ISidebarItem extends ISubItem {
  icon?: LucideIcon;
  items?: ISubItem[];
}

const STATIC_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    name: "Shifts",
    path: "/shifts",
    icon: AlarmClockPlus,
  },
  {
    name: "Classes",
    path: "/classes",
    icon: DraftingCompass,
  },
  {
    name: "Sections",
    path: "/sections",
    icon: WholeWord,
  },
  {
    name: "Teachers",
    path: "/teachers",
    icon: Speech,
  },
  {
    name: "Committee Members",
    path: "/committee-members",
    icon: ShieldUser,
  },
  {
    name: "Institute Details",
    path: "/about-info",
    icon: BadgeInfo,
  },
];

const fallbackSkeletonCount = 5;

export default function Sidebar() {
  const isSidebarOpen = useAppSelector((state) => state.sidebar.isSidebarOpen);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [items] = useState<ISidebarItem[]>(STATIC_SIDEBAR_ITEMS);

  if (!isSidebarOpen) return null;

  return (
    <div className="w-64 fixed top-16 left-0 overflow-y-auto pb-20 h-screen  z-10 p-4 border-l border-border bg-muted">
      <div className="flex flex-col space-y-10 w-full">
        <div className="flex flex-col space-y-0">
          {isPending || isLoading
            ? Array.from({ length: fallbackSkeletonCount }).map((_, i) => (
                <SidebarItemSkeleton key={i} hasSubItems={false} />
              ))
            : items.map((item, index) => (
                <SidebarItem key={index} item={item} />
              ))}
        </div>
      </div>
    </div>
  );
}
