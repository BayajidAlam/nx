"use client";

import { Card, CardContent } from "@/components/ui";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md border-0 rounded-2xl">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Login with your mobile number
            </p>
          </div>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
