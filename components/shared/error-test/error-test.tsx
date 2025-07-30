"use client";

import { Button } from "@/components/ui";
import { useState } from "react";

export default function ErrorTest() {
  const [boom, setBoom] = useState(false);

  if (boom) {
    throw new Error("Boom! User-triggered error");
  }

  return (
    <Button
      className="!cursor-pointer"
      size={"lg"}
      onClick={() => setBoom(true)}
    >
      Trigger Runtime Error
    </Button>
  );
}
