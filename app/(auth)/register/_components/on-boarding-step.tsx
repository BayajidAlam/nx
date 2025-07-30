/* eslint-disable @typescript-eslint/no-unused-vars */
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
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSendOtpMutation } from "@/redux/api/auth/auth.api";
import {
  onboardingSchema,
  OnboardingFormValues,
} from "../schemas/on-boarding-schema";

interface OnBoardingStepProps {
  className?: string;
  onNext: (data: OnboardingFormValues) => void;
  initialData?: OnboardingFormValues;
}

export default function OnBoardingStep({
  onNext,
  initialData,
  className,
}: OnBoardingStepProps) {
  // Redux hook for sending OTP
  const [sendOtp, { isLoading: isReduxLoading }] = useSendOtpMutation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: initialData || {
      phone: "",
      eiin: "", // Added eiin field as per your schema
    },
  });

  async function onSubmit(values: OnboardingFormValues) {
    setLoading(true);
    setError("");

    try {
      // Call the Redux API
      const result = await sendOtp({ phone: values.phone }).unwrap();
      
      if (result.success) {
        toast.success(result.message || "OTP sent successfully!");
        onNext(values);
      } else {
        throw new Error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Failed to send OTP. Please try again.";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

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
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your mobile number to begin
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-base font-medium ">
                      Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="e.g. 017 00 - 00 00 00"
                        className="w-full mt-2 px-4 py-3 sm:py-4 text-base sm:text-lg border border-border rounded-lg focus:outline-none focus:border-transparent focus:shadow transition-all duration-200"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base text-destructive" />
                  </FormItem>
                )}
              />

              {/* Add EIIN field as per your schema */}
              <FormField
                control={form.control}
                name="eiin"
                render={({ field }) => (
                  <FormItem className="space-y-2 sm:space-y-3">
                    <FormLabel className="text-base font-medium ">
                      EIIN
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your EIIN"
                        className="w-full mt-2 px-4 py-3 sm:py-4 text-base sm:text-lg border border-border rounded-lg focus:outline-none focus:border-transparent focus:shadow transition-all duration-200"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm sm:text-base text-destructive" />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="flex-1 w-full opacity-95 hover:opacity-100  font-medium py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg transition-colors duration-200 shadow-sm !cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
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