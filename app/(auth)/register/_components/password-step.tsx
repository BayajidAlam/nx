"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui/";
import { passwordRequirements } from "@/constants/password-requirements";
import { cn } from "@/lib/utils";
import { useSetPasswordMutation } from "@/redux/api/auth/auth.api";
import {
  passwordSchema,
  PasswordFormValues,
} from "../schemas/password-schema";

interface PasswordStepProps {
  token: string;
  onComplete: () => void;
  onBack: () => void;
  className?: string;
}

export default function PasswordStep({
  className,
  onBack,
  onComplete,
  token,
}: PasswordStepProps) {
  // Redux hook
  const [setPassword, { isLoading: isReduxLoading }] = useSetPasswordMutation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  // Initialize form
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch the password field for real-time validation
  const watchedPassword = form.watch("password");

  // Handle form submission
  async function handleSubmit(values: PasswordFormValues) {
    setLoading(true);
    setError("");

    try {
      // Call the Redux API with token in headers
      const result = await setPassword({ 
        password: values.password 
      }).unwrap();
      
      if (result.success) {
        setSuccess("Password set successfully!");
        toast.success(result.message || "Password set successfully!");
        
        // Small delay to show success message
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        throw new Error(result.message || "Failed to set password");
      }
    } catch (error: any) {
      console.error("Set password error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Failed to set password. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPassword(watchedPassword || "");
  }, [watchedPassword]);

  // Use either local loading or Redux loading
  const isSubmitting = loading || isReduxLoading;

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted",
        className
      )}
    >
      <Card className="w-full max-w-md border-0 rounded-2xl">
        <CardHeader>
          <div className="space-y-2 sm:space-y-3 text-center">
            <h1 className="text-2xl font-medium text-foreground leading-tight">
              Great! your account is verified. Set your new password.
            </h1>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* New Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-base font-medium text-foreground">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          className="w-full px-4 py-3 text-base  border border-input rounded-lg bg-background   pr-12 focus:outline-none focus:border-transparent focus:shadow transition-all duration-200"
                          {...field}
                          aria-describedby="new-password-requirements"
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          aria-label={
                            showNewPassword ? "Hide password" : "Show password"
                          }
                          disabled={isSubmitting}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4  text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4  text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm " />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-base font-medium text-foreground">
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          className="w-full px-4 py-3 text-base border border-input rounded-lg bg-background pr-12 focus:outline-none focus:border-transparent focus:shadow transition-all duration-200"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          disabled={isSubmitting}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm " />
                  </FormItem>
                )}
              />

              {/* Password Requirements */}
              <div
                id="new-password-requirements"
                className="text-xs text-muted-foreground space-y-2"
              >
                <p className="font-medium">Password must contain:</p>
                <ul className="space-y-2">
                  {passwordRequirements.map((requirement) => {
                    const isMet = requirement.test(currentPassword);
                    return (
                      <li
                        key={requirement.id}
                        className="flex items-center space-x-2"
                      >
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

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">
                    {success}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="flex-1 w-full opacity-95 hover:opacity-100  font-medium py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg transition-colors duration-200 shadow-sm !cursor-pointer"
                >
                  Back
                </Button>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="flex-1 w-full opacity-95 hover:opacity-100  font-medium py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg transition-colors duration-200 shadow-sm !cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
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