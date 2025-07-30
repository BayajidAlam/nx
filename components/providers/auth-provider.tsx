"use client";

import { useAppDispatch } from "@/hooks/use-store";
import { initializeAuth } from "@/redux/slices/auth/auth.slice";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}