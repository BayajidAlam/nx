"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getNextStep,
  getPreviousStep,
  ResStep,
} from "./_helpers/registration-steps";

import { CongratulationsStep } from "./_components/congratulations-step";
import OnBoardingStep from "./_components/on-boarding-step";
import OTPVerificationStep from "./_components/otp-verification-step";
import PasswordStep from "./_components/password-step";
import { OnboardingFormValues } from "./schemas/on-boarding-schema";

interface RegistrationData {
  phone: string;
  token?: string;
}

export default function RegistrationPage() {
  const router = useRouter();

  const [step, setStep] = useState<ResStep>(ResStep.RES_PHONE);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    phone: "",
  });

  const handleNext = () => {
    const next = getNextStep(step);
    if (next) {
      setStep(next);
    }
  };

  const handleBack = () => {
    const prev = getPreviousStep(step);
    if (prev) setStep(prev);
  };

  const handlePhoneNext = (data: OnboardingFormValues) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
    handleNext();
  };

  const handleOTPNext = (token: string) => {
    setRegistrationData((prev) => ({ ...prev, token }));
    handleNext();
  };

  const handleComplete = () => {
    setShowCongratulations(true);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (showCongratulations) {
    return <CongratulationsStep onLogin={handleLogin} />;
  }

  console.log(step);
  return (
    <section className="w-full h-full">
      {step === ResStep.RES_PHONE && (
        <OnBoardingStep
          onNext={handlePhoneNext}
          initialData={{
            phone: registrationData.phone,
          }}
        />
      )}

      {step === ResStep.VERIFY_RES_OTP && (
        <OTPVerificationStep onNext={handleOTPNext} onBack={handleBack} />
      )}

      {step === ResStep.CONFIRM_RES_PASSWORD && (
        <PasswordStep
          token={registrationData.token || ""}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      )}
    </section>
  );
}
