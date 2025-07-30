"use client";

import { Card } from "@/components/ui";
import { SplineScene } from "./spline-scene";
import { Spotlight } from "./spotlight";

export function UnderConstruction() {
  return (
    <Card className="w-full h-[80vh] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative overflow-hidden border-0">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="hsl(var(--primary))"
      />

      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            Page Is Under Construction
          </h1>
          <p className="mt-6 text-muted-foreground max-w-lg text-lg md:text-xl leading-relaxed">
            Meanwhile play with our pet robot. Don&apos;t worry he doesn&apos;t
            bite.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
