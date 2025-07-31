// app/(auth)/login/_components/login-form.tsx - COMPLETE VERSION
"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/hooks/use-store";
import { loginSuccess, selectAuth } from "@/redux/slices/auth/auth.slice";
import { useUserLoginMutation } from "@/redux/api/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginFormSchema, loginFormValues } from "../schemas/login-form-schema";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  
  // Redux hooks
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const authState = useAppSelector(selectAuth);

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  // Debug: Watch auth state changes
  useEffect(() => {
    console.log("🔍 Auth state changed:", authState);
  }, [authState]);

  const onSubmit = async (data: loginFormValues) => {
    try {
      console.log("📤 Submitting login with data:", data);
      
      const result = await userLogin(data).unwrap();
      console.log("📥 Login API result:", result);
      
      if (result.success) {
        console.log("✅ Login successful, dispatching loginSuccess...");
        
        // Store token and update auth state
        dispatch(loginSuccess(result.token));
        
        // Manual localStorage storage as backup
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", result.token);
          console.log("💾 Manual localStorage set:", localStorage.getItem("auth_token"));
        }
        
        toast.success(result.message || "Login successful!");
        
        // Check localStorage and navigate
        setTimeout(() => {
          console.log("🔍 Final localStorage check:", localStorage.getItem("auth_token"));
          console.log("🔍 Final auth state:", authState);
          router.push("/");
        }, 300);
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      // Handle different error types
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Login failed. Please try again.";
      
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-base font-medium ">
                Mobile Number
              </FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <Input
                    type="tel"
                    placeholder="e.g. 017 00 - 00 00 00"
                    disabled={isLoading}
                    className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-border rounded-lg focus:outline-none focus:border-transparent focus:shadow transition-all duration-200"
                    {...field}
                  />
                </div>
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-base font-medium ">Password</FormLabel>
              <FormControl>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-border rounded-lg focus:outline-none focus:border-transparent focus:shadow transition-all duration-200"
                    {...field}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center pt-2">
          <Button variant="link" asChild className="text-sm px-0 h-auto">
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>
          <Button variant="link" asChild className="text-sm px-0 h-auto">
            <Link href="/register">Activate Account</Link>
          </Button>
        </div>

        <Button className="w-full mt-2" type="submit" disabled={isLoading}>
          {isLoading ? "wait..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}