import Main from "@/components/others/main/Main";
import Navbar from "@/components/others/navbar";
import Sidebar from "@/components/others/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "welcome",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppLayout>{children}</AppLayout>
    </>
  );
}

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* <!-- ===== Sidebar ===== --> */}
      <Sidebar />
      {/* <!-- ===== Content Area  ===== --> */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* <!-- ===== Navbar  ===== --> */}
        <Navbar />
        {/* <!-- ===== Main Content  ===== --> */}
        <Main>{children}</Main>

        {/* <!-- ===== Footer ===== --> */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}
