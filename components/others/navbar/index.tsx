"use client";
import Link from "next/link";

import { DarkModeSwitch } from "@/components/shared/dark-mode/dark-mode-switch";
import FullscreenButton from "@/components/shared/full-screen-button/full-screen-button";
import SidebarToggler from "@/components/shared/sidebar-toggler/sidebar-toggler";
import { UserMenu } from "../user-menu/user-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex w-full border-b border-border bg-muted">
      <div className="flex flex-grow items-center justify-between px-4 py-3 shadow-2 ">
        <div className="flex flex-row items-center justify-between gap-2 w-full max-w-[14.5rem] 2xl:max-w-[13.5rem] pl-4">
          <div className="">
            <Link href={"/"} className="flex items-center justify-center gap-1">
              <div className="font-medium text-md">IMS PORTAL</div>
            </Link>
          </div>
          <div className="flex justify-center items-center gap-3">
            <SidebarToggler />
          </div>
        </div>

        <div className="flex items-center gap-1 lg:gap-4 2xsm:gap-7">
          {/* <!-- Dark Mode Toggler --> */}
          <DarkModeSwitch />

          <FullscreenButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
