import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AvatarWithInitialsProps {
  src?: string;
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarWithInitials({
  src,
  initials,
  size = "md",
  className,
}: AvatarWithInitialsProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && <AvatarImage src={src || "/placeholder.svg"} alt={initials} />}
      <AvatarFallback className={cn("bg-[#FBE9CE] text-[#F39C12]", className)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
