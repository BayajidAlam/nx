"use client";

import { setIsFullscreen } from "@/redux/slices/full-screen/full-screen.slice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./use-store";

interface FullScreenStateProps {
  isFullscreen: boolean;
  toggleFullScreen: () => void;
}

export default function useFullScreen(): FullScreenStateProps {
  const { isFullscreen } = useAppSelector((state) => state.fullScreen);
  const dispatch = useAppDispatch();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        dispatch(setIsFullscreen(true));
      });
    } else {
      document.exitFullscreen().then(() => {
        dispatch(setIsFullscreen(false));
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      dispatch(setIsFullscreen(!!document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    toggleFullScreen,
  };
}
