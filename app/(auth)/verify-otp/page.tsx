"use client";

import {
  Button,
  Card,
  CardContent,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui";
import { useState } from "react";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("Verifying OTP:", otp);
    // Example navigation:
    // router.push("/dashboard");
  };

  const handleResend = () => {
    console.log("Resending OTP...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md border-0 rounded-2xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verify OTP
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter the 6-digit code sent to your phone
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>

                  <InputOTPSeparator />

                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button className="w-full mt-2" onClick={handleVerify}>
              Verify
            </Button>

            <div className="text-center pt-2">
              <Button variant="link" className="text-sm" onClick={handleResend}>
                Resend OTP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
