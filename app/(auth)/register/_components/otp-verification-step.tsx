"use client";

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
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui";

import { cn } from "@/lib/utils";
import { useVerifyOtpMutation, useResendOtpMutation } from "@/redux/api/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { OtpFormSchema, OtpFormValues } from "../schemas/otp-schema";

interface OTPVerificationStepProps {
  onBack: () => void;
  onNext: (token: string) => void;
  phone?: string; // Phone number for verification
  className?: string;
}

export default function OTPVerificationStep({
  onBack,
  onNext,
  phone,
  className,
}: OTPVerificationStepProps) {
  // Redux hooks
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);

  // Initialize form
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Watch OTP value for submit button state
  const otpValue = form.watch("otp");

  // Handle form submission
  async function handleSubmit(values: OtpFormValues) {
    if (!phone) {
      setError("Phone number not found. Please go back and try again.");
      return;
    }

    setLoading(true);
    setError("");

    const otp = Number(values.otp);

    if (isNaN(otp)) {
      setError("OTP must be a valid number.");
      setLoading(false);
      return;
    }

    try {
      const result = await verifyOtp({ 
        phone: phone, 
        otp: values.otp 
      }).unwrap();
      
      if (result.success) {
        toast.success(result.message || "OTP verified successfully!");
        onNext(result.token);
      } else {
        throw new Error(result.message || "Invalid OTP");
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Invalid or expired OTP. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Handle resend
  const handleResendOTP = async () => {
    if (!phone) {
      setError("Phone number not found");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const result = await resendOtp({ phone }).unwrap();
      
      if (result.success) {
        setSuccess("OTP resent successfully!");
        toast.success(result.message || "OTP resent successfully!");
        setCountdown(60);
        form.reset();
      } else {
        throw new Error(result.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Failed to resend OTP. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Use either local loading or Redux loading
  const isSubmitting = loading || isVerifying;
  const isResendingOtp = resending || isResending;

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted",
        className
      )}
    >
      <Card className="w-full max-w-md border-0 rounded-2xl">
        <CardHeader>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify OTP
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter the 6-digit code sent to your phone
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* OTP Input using shadcn InputOTP */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          className="gap-2 sm:gap-3 lg:gap-4"
                          disabled={isSubmitting}
                        >
                          <InputOTPGroup className="gap-2 sm:gap-3 lg:gap-4">
                            <InputOTPSlot
                              index={0}
                              className="w-12 h-12 text-lg font-medium border-2 rounded-lg"
                            />
                            <InputOTPSlot
                              index={1}
                              className="w-12 h-12  text-lg font-medium border-2 rounded-lg"
                            />
                            <InputOTPSlot
                              index={2}
                              className="w-12 h-12  text-lg font-medium border-2 rounded-lg"
                            />
                            <InputOTPSlot
                              index={3}
                              className="w-12 h-12  text-lg font-medium border-2 rounded-lg"
                            />
                            <InputOTPSlot
                              index={4}
                              className="w-12 h-12 text-lg font-medium border-2 rounded-lg"
                            />
                            <InputOTPSlot
                              index={5}
                              className="w-12 h-12 text-lg font-medium border-2 rounded-lg"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center text-sm " />
                  </FormItem>
                )}
              />

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

              {/* Resend Section */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={isResendingOtp || countdown > 0}
                  className="text-sm cursor-pointer"
                >
                  {isResendingOtp ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              </div>

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
                <Button
                  type="submit"
                  className="flex-1 w-full opacity-95 hover:opacity-100  font-medium py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg transition-colors duration-200 shadow-sm !cursor-pointer"
                  disabled={otpValue.length !== 6 || isSubmitting}
                >
                  {isSubmitting ? (
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
        </CardContent>
      </Card>
    </div>
  );
}