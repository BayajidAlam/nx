"use client";
import { Button } from "@/components/ui";
import useFullScreen from "@/hooks/use-full-screen";

import { Expand, Shrink } from "lucide-react";

function FullscreenButton() {
  const { isFullscreen, toggleFullScreen } = useFullScreen();

  return (
    <div>
      <Button
        variant="outline"
        className="px-2 hidden md:block hover:text-primary dark:hover:bg-white/10 dark:text-white dark:border-white/70 border-none bg-transparent cursor-pointer"
        onClick={toggleFullScreen}
      >
        {isFullscreen ? <Shrink size={20} /> : <Expand size={20} />}
      </Button>
    </div>
  );
}

export default FullscreenButton;
