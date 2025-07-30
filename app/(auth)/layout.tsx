import { RouteGuard } from "@/components/auth/route-guard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or register to access your account",
};

export default function AuthLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <RouteGuard requireAuth={false} redirectTo="/">
      {children}
    </RouteGuard>
  );
}