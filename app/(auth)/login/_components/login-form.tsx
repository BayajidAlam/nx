// app/(auth)/login/_components/login-form.tsx
"use client";

import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from "@/components/ui";
import { useAppDispatch } from "@/hooks/use-store";
import { loginSuccess } from "@/redux/slices/auth/auth.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginFormSchema, type loginFormValues } from "../schemas/login-form-schema";
import { useUserLoginMutation } from "@/redux/api/auth/auth.api";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  
  const [userLogin, { isLoading }] = useUserLoginMutation();

  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: loginFormValues) => {
    try {
      const result = await userLogin(values).unwrap();
      
      if (result.success) {
        // Store token and update auth state
        dispatch(loginSuccess(result.token));
        
        toast.success(result.message || "Login successful!");
        
        // Redirect to dashboard
        router.push("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
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
        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="01700000000"
                  disabled={isLoading}
                  className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-border rounded-lg focus:outline-none focus:border-transparent focus:shadow transition-all duration-200"
                  {...field}
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full px-4 py-3 sm:py-4 text-base sm:text-lg border border-border rounded-lg focus:outline-none focus:border-transparent focus:shadow transition-all duration-200 pr-12"
                    {...field}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
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

        {/* Links */}
        <div className="flex justify-between items-center pt-2">
          <Button variant="link" asChild className="text-sm px-0 h-auto">
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>
          <Button variant="link" asChild className="text-sm px-0 h-auto">
            <Link href="/register">Activate Account</Link>
          </Button>
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full mt-2" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}