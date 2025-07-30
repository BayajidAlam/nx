// app/(auth)/register/_components/password-step.tsx - Updated
"use client";

import {  Button, Card, CardContent, Form, FormControl, FormField, FormItem, FormMessage, Input, Label } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {   passwordSchema, type PasswordFormValues } from "../schemas/password-schema";
import { useSetPasswordMutation } from "@/redux/api/auth/auth.api";

interface PasswordStepProps {
  token: string;
  onComplete: () => void;
  onBack: () => void;
}

// Password requirements
const passwordRequirements = [
  {
    id: "length",
    label: "At least 6 characters",
    test: (password: string) => password.length >= 6,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase", 
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password: string) => /\d/.test(password),
  },
];

export default function PasswordStep({ token, onComplete, onBack }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [setPassword, { isLoading }] = useSetPasswordMutation();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const currentPassword = form.watch("password");

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      // Set authorization header with the OTP token
      const result = await setPassword({ 
        password: values.password 
      }).unwrap();
      
      if (result.success) {
        toast.success(result.message || "Password set successfully!");
        onComplete();
      }
    } catch (error: any) {
      console.error("Set password error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Failed to set password. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md border-0 rounded-2xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Set Your Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a secure password for your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          className="w-full px-4 py-3 text-base border border-border rounded-lg pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowPassword(!showPassword)}
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

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          disabled={isLoading}
                          className="w-full px-4 py-3 text-base border border-border rounded-lg pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
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

              {/* Password Requirements */}
              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-medium">Password must contain:</p>
                <ul className="space-y-2">
                  {passwordRequirements.map((requirement) => {
                    const isMet = requirement.test(currentPassword);
                    return (
                      <li key={requirement.id} className="flex items-center space-x-2">
                        <div
                          className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors duration-200 ${
                            isMet
                              ? "bg-green-100 text-green-600"
                              : currentPassword.length > 0
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isMet ? (
                            <Check className="w-3 h-3" />
                          ) : currentPassword.length > 0 ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                          )}
                        </div>
                        <span
                          className={`transition-colors duration-200 ${
                            isMet
                              ? "text-green-600"
                              : currentPassword.length > 0
                                ? "text-red-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          {requirement.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Setting...
                    </>
                  ) : (
                    "Set Password"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}