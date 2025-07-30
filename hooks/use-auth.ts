"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { 
  loginSuccess, 
  logout, 
  selectAuth, 
  selectIsAuthenticated, 
  selectUser 
} from "@/redux/slices/auth/auth.slice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const login = (token: string) => {
    dispatch(loginSuccess(token));
  };

  const logoutUser = () => {
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