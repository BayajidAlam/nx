"use client";
import { useAppSelector } from "@/hooks/use-store";

export default function Main({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useAppSelector((state) => state.sidebar.isSidebarOpen);
  return (
    <main
      className={`${
        !isSidebarOpen ? "ml-0" : "ml-64"
      } transition-all ease-in-out duration-500`}
    >
      <div className="mx-auto w-full p-4 md:p-4 2xl:px-6 py-4">{children}</div>
    </main>
  );
}
