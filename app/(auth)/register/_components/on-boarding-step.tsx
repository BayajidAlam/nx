"use client";

import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input, Label } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSendOtpMutation } from "@/redux/api/auth/auth.api";
import { OnboardingFormValues, onboardingSchema } from "../schemas/on-boarding-schema";

interface OnBoardingStepProps {
  onNext: (data: OnboardingFormValues) => void;
  initialData?: Partial<OnboardingFormValues>;
}

export default function OnBoardingStep({ onNext, initialData }: OnBoardingStepProps) {
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      phone: initialData?.phone || "",
      eiin: initialData?.eiin || "",
    },
  });

  const onSubmit = async (values: OnboardingFormValues) => {
    try {
      const result = await sendOtp({ phone: values.phone }).unwrap();
      if (result.success) {
        toast.success(result.message || "OTP sent successfully!");
        onNext(values);
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      const errorMessage = 
        error?.data?.error?.message || 
        error?.data?.message || 
        error?.message || 
        "Failed to send OTP. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Label htmlFor="phone">Phone Number</Label>
                  <FormControl>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01700000000"
                      disabled={isLoading}
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

            <FormField
              control={form.control}
              name="eiin"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Label htmlFor="eiin">EIIN Number</Label>
                  <FormControl>
                    <Input
                      id="eiin"
                      type="text"
                      placeholder="Enter EIIN number"
                      disabled={isLoading}
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
              className="w-full mt-6" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
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
      </div>
    </div>
  );
}