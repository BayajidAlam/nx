import { cn } from "@/lib/utils";

interface BadgePillProps {
  label: string;
  variant?: "default" | "important" | "lead";
  className?: string;
}

export function BadgePill({
  label,
  variant = "default",
  className,
}: BadgePillProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    important: "bg-[#F6ECF8] text-[#C280D2]",
    lead: "bg-[#E2F4F3] text-[#43B9B2]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
