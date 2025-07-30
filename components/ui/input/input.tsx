import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:outline-none focus:border-transparent focus:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border focus-visible:ring-offset-0",

          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
