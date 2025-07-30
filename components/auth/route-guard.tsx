"use client";

import { useAppSelector } from "@/hooks/use-store";
import { selectAuth } from "@/redux/slices/auth/auth.slice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector(selectAuth);

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        router.push("/");
      }
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For auth required routes, only show content if authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // For public routes (login/register), hide if already authenticated
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}