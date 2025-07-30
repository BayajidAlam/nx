import { Label } from "@/components/ui/";
import { ReactNode } from "react";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
  description?: string;
  htmlFor?: string;
  className?: string;
}

export default function FieldLabel({
  children,
  required = false,
  description,
  htmlFor,
  className = "",
}: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={className}>
      {children}
      {required && <span className="text-red-500"> *</span>}
      {description && (
        <div className="ml-2 text-xs text-muted-foreground inline-block">
          {description}
        </div>
      )}
    </Label>
  );
}
