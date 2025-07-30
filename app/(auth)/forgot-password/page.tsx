// app/(auth)/forgot-password/page.tsx
"use client";

import { Button, Card, CardContent, Form, FormControl, FormField, FormItem, FormMessage, Input } from "@/components/ui";
import { useForgotPasswordMutation, useResetPasswordMutation, useVerifyForgotPasswordOtpMutation } from "@/redux/api/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schemas
const phoneSchema = z.object({
  phone: z.string().min(11, "Phone number must be at least 11 digits").max(11, "Phone number must be 11 digits"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

enum ForgotPasswordStep {
  PHONE = "phone",
  OTP = "otp", 
  PASSWORD = "password",
  SUCCESS = "success"
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>(ForgotPasswordStep.PHONE);
  const [phone, setPhone] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotPassword, { isLoading: isLoadingForgotPassword }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isLoadingVerifyOtp }] = useVerifyForgotPasswordOtpMutation();
  const [resetPassword, { isLoading: isLoadingResetPassword }] = useResetPasswordMutation();

  // Phone form
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  // OTP form
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handlePhoneSubmit = async (values: PhoneFormValues) => {
    try {
      const result = await forgotPassword(values).unwrap();
      if (result.success) {
        setPhone(values.phone);
        setStep(ForgotPasswordStep.OTP);
        toast.success(result.message || "OTP sent to your phone");
      }
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpSubmit = async (values: OtpFormValues) => {
    try {
      const result = await verifyOtp({ phone, otp: values.otp }).unwrap();
      if (result.success) {
        setResetToken(result.token);
        setStep(ForgotPasswordStep.PASSWORD);
        toast.success(result.message || "OTP verified successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || "Invalid or expired OTP");
    }
  };

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    try {
      const result = await resetPassword({ newPassword: values.newPassword }).unwrap();
      if (result.success) {
        setStep(ForgotPasswordStep.SUCCESS);
        toast.success(result.message || "Password reset successful");
      }
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md border-0 rounded-2xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === ForgotPasswordStep.PHONE && "Forgot Password"}
              {step === ForgotPasswordStep.OTP && "Verify OTP"}
              {step === ForgotPasswordStep.PASSWORD && "Reset Password"}
              {step === ForgotPasswordStep.SUCCESS && "Success!"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === ForgotPasswordStep.PHONE && "Enter your phone number to receive an OTP"}
              {step === ForgotPasswordStep.OTP && `Enter the OTP sent to ${phone}`}
              {step === ForgotPasswordStep.PASSWORD && "Create a new password"}
              {step === ForgotPasswordStep.SUCCESS && "Your password has been reset successfully"}
            </p>
          </div>

          {/* Phone Step */}
          {step === ForgotPasswordStep.PHONE && (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="01700000000"
                          disabled={isLoadingForgotPassword}
                          className="w-full px-4 py-3 text-base border border-border rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                
                <Button 
                  className="w-full" 
                  type="submit" 
                  disabled={isLoadingForgotPassword}
                >
                  {isLoadingForgotPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* OTP Step */}
          {step === ForgotPasswordStep.OTP && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          disabled={isLoadingVerifyOtp}
                          className="w-full px-4 py-3 text-base border border-border rounded-lg text-center tracking-widest"
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(ForgotPasswordStep.PHONE)}
                    disabled={isLoadingVerifyOtp}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    type="submit" 
                    disabled={isLoadingVerifyOtp}
                  >
                    {isLoadingVerifyOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Password Step */}
          {step === ForgotPasswordStep.PASSWORD && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
                            disabled={isLoadingResetPassword}
                            className="w-full px-4 py-3 text-base border border-border rounded-lg pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoadingResetPassword}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            disabled={isLoadingResetPassword}
                            className="w-full px-4 py-3 text-base border border-border rounded-lg pr-12"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoadingResetPassword}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(ForgotPasswordStep.OTP)}
                    disabled={isLoadingResetPassword}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    type="submit" 
                    disabled={isLoadingResetPassword}
                  >
                    {isLoadingResetPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Success Step */}
          {step === ForgotPasswordStep.SUCCESS && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-medium">Password reset successfully!</p>
              <Button 
                className="w-full" 
                onClick={() => router.push("/login")}
              >
                Continue to Login
              </Button>
            </div>
          )}

          {/* Back to Login */}
          {step !== ForgotPasswordStep.SUCCESS && (
            <div className="text-center">
              <Button variant="link" asChild className="text-sm">
                <Link href="/login" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}