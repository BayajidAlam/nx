"use client";

import { Button, Card, CardContent, Input, Label } from "@/components/ui";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [mobile, setMobile] = useState("");

  const handleSendOtp = () => {
    // TODO: Trigger password reset OTP send
    console.log("Sending OTP to", mobile);
    // router.push("/verify-otp"); // Optional route
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md border-0 rounded-2xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your mobile number to receive a reset code
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                placeholder="e.g. 017 00 - 00 00 00"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="tel"
              />
            </div>

            <Button className="w-full mt-2" onClick={handleSendOtp}>
              Send OTP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
