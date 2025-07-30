import { RouteGuard } from "@/components/auth/route-guard";
import Main from "@/components/others/main/Main";
import Navbar from "@/components/others/navbar";
import Sidebar from "@/components/others/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your dashboard",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RouteGuard requireAuth={true} redirectTo="/login">
      <AppLayout>{children}</AppLayout>
    </RouteGuard>
  );
}

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Navbar />
        <Main>{children}</Main>
      </div>
    </div>
  );
}