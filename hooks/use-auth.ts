"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { 
  loginSuccess, 
  logout, 
  selectAuth, 
  selectIsAuthenticated, 
  selectUser 
} from "@/redux/slices/auth/auth.slice";
import { useLogoutMutation } from "@/redux/api/auth/auth.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Logout mutation to clear refresh token cookie on server
  const [logoutMutation] = useLogoutMutation();

  const login = (token: string) => {
    dispatch(loginSuccess(token));
  };

  const logoutUser = async () => {
    try {
      // Call server logout to clear refresh token cookie
      await logoutMutation().unwrap();
      console.log("🍪 Server logout successful - refresh token cookie cleared");
    } catch (error) {
      console.error("Server logout failed:", error);
      // Continue with client-side logout even if server logout fails
    }
    
    // Always perform client-side logout
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return {
    ...auth,
    user,
    isAuthenticated,
    login,
    logout: logoutUser,
  };
}