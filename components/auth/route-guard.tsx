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
  
  // Get auth state with error handling
  let authState;
  try {
    authState = useAppSelector(selectAuth);
    console.log("🛡️ Route Guard - Auth state:", authState);
  } catch (error) {
    console.error("❌ Route Guard - Redux selector error:", error);
    
    // Fallback - check localStorage directly
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      authState = {
        isAuthenticated: !!token,
        loading: false,
        user: null,
        token: token,
      };
      console.log("📱 Route Guard - Using localStorage fallback:", authState);
    } else {
      authState = { isAuthenticated: false, loading: true, user: null, token: null };
    }
  }

  const { isAuthenticated = false, loading = true } = authState || {};

  useEffect(() => {
    console.log("🔄 Route Guard effect - Auth:", { isAuthenticated, loading, requireAuth });
    
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        console.log("🚪 Redirecting to login - auth required but not authenticated");
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        console.log("🏠 Redirecting to home - authenticated user on auth page");
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
    console.log("🚫 Blocking access - auth required but not authenticated");
    return null;
  }

  // For public routes (login/register), hide if already authenticated
  if (!requireAuth && isAuthenticated) {
    console.log("🔄 Hiding auth page - user already authenticated");
    return null;
  }

  console.log("✅ Route Guard - Access granted");
  return <>{children}</>;
}