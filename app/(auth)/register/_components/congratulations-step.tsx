"use client";

import { Button } from "@/components/ui";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface CongratulationsStepProps {
  className?: string;
  onLogin: () => void;
}

export function CongratulationsStep({
  className,
  onLogin,
}: CongratulationsStepProps) {
  // Confetti animation effect
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Additional burst effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div
      className={`h-screen overflow-hidden hide-scrollbar w-full relative ${
        className || ""
      }`}
    >
      <div className="relative z-10 flex flex-col justify-between min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12 2xl:space-y-14">
            {/* Congratulations heading */}
            <h1 className="font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl tracking-tight leading-none">
              Congratulations!
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-base sm:text-lg lg:text-xl xl:text-2xl font-normal leading-relaxed">
              Your account has been created successfully.
            </p>

            {/* CTA Button */}
            <Button
              className="font-medium px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-14 py-2.5 sm:py-3 lg:py-4 xl:py-5 2xl:py-6 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl rounded-lg transition-colors duration-200 shadow-sm !cursor-pointer"
              size="lg"
              onClick={() => {
                triggerConfetti();
                setTimeout(() => onLogin(), 500);
              }}
            >
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
