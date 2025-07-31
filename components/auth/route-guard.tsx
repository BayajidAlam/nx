// components/auth/route-guard.tsx - FIXED WITH ERROR HANDLING
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
  
  // Add error handling for Redux selector
  let authState;
  try {
    authState = useAppSelector(selectAuth);
    console.log("🛡️ Route Guard - Auth state:", authState);
  } catch (error) {
    console.error("❌ Route Guard - Redux selector error:", error);
    console.log("🔍 Trying to debug Redux state...");
    
    // Fallback - show loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // If authState is undefined, something is wrong with Redux
  if (!authState) {
    console.error("❌ Auth state is undefined! Redux store issue.");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Authentication system error. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const { isAuthenticated = false, loading = true } = authState;

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