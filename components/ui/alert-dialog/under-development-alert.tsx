"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

interface UnderDevelopmentAlertProps {
  children: ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function UnderDevelopmentAlert({
  children,
  onConfirm,
  title = "Feature Under Development",
  description = "This feature is currently under development. You can explore it in test mode to preview the experience.",
  className,
}: UnderDevelopmentAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className={cn("bg-background border-0", className)}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Enter Test Mode
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
