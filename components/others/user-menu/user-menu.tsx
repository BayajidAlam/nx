import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";

export interface UserMenuProps {
  name?: string;
  image?: string | null;
  designation?: string;
}

export function UserMenu({
  name = "John Does",
  image = null,
  designation = "admin",
}: UserMenuProps) {
  console.log(name);
  const fullName = name ?? "";

  // Get initials for avatar fallback
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-md px-1.5 py-0.5 outline-none hover:bg-accent dark:hover:bg-white/10 !cursor-pointer">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9  bg-transparent cursor-pointer border border-border opacity-100">
            <AvatarImage src={image ?? ""} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start -space-y-1">
            <p className="text-sm font-medium text-foreground dark:text-white">
              {fullName}
            </p>
            <p className="text-xs text-muted-foreground">{designation}</p>
          </div>
        </div>
        <ChevronDown className=" h-4 w-4 text-muted-foreground dark:text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 dark:bg-background dark:border-white/60"
      >
        <DropdownMenuItem
          asChild
          className="dark:hover:bg-white/10 cursor-pointer"
        >
          <Link href="/settings" className="w-full text-end cursor-pointer">
            <User className="mr-1 h-4 w-4" /> Edit Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {}}
          className="text-red-600 focus:text-red-600  w-full text-end dark:hover:bg-white/10 cursor-pointer"
        >
          <LogOut className="mr-1 h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
