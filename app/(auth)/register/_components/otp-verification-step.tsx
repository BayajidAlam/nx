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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { OtpFormSchema, OtpFormValues } from "../schemas/otp-schema";

interface OTPVerificationStepProps {
  onBack: () => void;
  onNext: (token: string) => void;
  className?: string;
}

export default function OTPVerificationStep({
  onBack,
  onNext,
  className,
}: OTPVerificationStepProps) {
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
    setLoading(true);
    setError("");

    const otp = Number(values.otp);

    if (isNaN(otp)) {
      setError("OTP must be a valid number.");
      setLoading(false);
      return;
    }

    onNext("hello");
  }

  // Handle resend
  const handleResendOTP = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      setSuccess("OTP resent successfully!");
      setCountdown(60);
      form.reset();
    } catch (err) {
      setError("Failed to resend OTP");
      console.log(err);
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
                  disabled={resending || countdown > 0}
                  className="text-sm cursor-pointer"
                >
                  {resending ? (
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
                  className="flex-1 w-full opacity-95 hover:opacity-100  font-medium py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg transition-colors duration-200 shadow-sm !cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 w-full opacity-95 hover:opacity-100  font-medium py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg transition-colors duration-200 shadow-sm !cursor-pointer"
                  disabled={otpValue.length !== 6 || loading}
                >
                  {loading ? (
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
