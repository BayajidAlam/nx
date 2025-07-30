"use client";

import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from "@/components/ui";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/api/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OTPVerificationStepProps {
  onNext: (token: string) => void;
  onBack: () => void;
  phone?: string;
}

export default function OTPVerificationStep({ onNext, onBack, phone }: OTPVerificationStepProps) {
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (values: OtpFormValues) => {
    try {
      const result = await verifyOtp({ 
        phone: phone || "", 
        otp: values.otp 
      }).unwrap();
      
      if (result.success) {
        toast.success(result.message || "OTP verified successfully!");
        onNext(result.token);
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Invalid or expired OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    if (!phone) {
      toast.error("Phone number not found");
      return;
    }

    try {
      const result = await resendOtp({ phone }).unwrap();
      if (result.success) {
        toast.success(result.message || "OTP resent successfully!");
        setCountdown(300);
        setCanResend(false);
        form.reset();
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify Your Phone
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your phone
          </p>
          {phone && (
            <p className="text-sm font-medium text-primary">
              {phone}
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      disabled={isLoading}
                      className="w-full px-4 py-4 text-xl text-center tracking-widest border border-border rounded-lg"
                      maxLength={6}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Timer and Resend */}
            <div className="text-center space-y-2">
              {!canResend ? (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {formatTime(countdown)}
                </p>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onBack}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                className="flex-1" 
                type="submit" 
                disabled={isLoading || form.watch("otp").length !== 6}
              >
                {isLoading ? (
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
      </div>
    </div>
  );
}