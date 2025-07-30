import { Toaster, TooltipProvider } from "@/components/ui";
import { outfit } from "@/fonts/fonts";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "@/providers/redux-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "School Management",
    template: "%s | School Management",
  },
  description: "School Management",
  keywords: ["School Management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("", outfit.variable)}
      suppressHydrationWarning
    >
      <body className={cn("min-h-screen bg-background font-sans antialiased ")}>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </ReduxProvider>

        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
