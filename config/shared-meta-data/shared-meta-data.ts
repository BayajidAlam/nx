import type { Metadata } from "next";

export const sharedMetadata: Metadata = {
  title: {
    template: "%s | Welcome",
    default: "Welcome",
  },
  description: "Welcome",
  icons: {
    icon: "/favicon.ico",
  },
};
