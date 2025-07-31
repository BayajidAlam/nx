"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  console.log("🔄 Redux Provider initializing...");
  
  // Debug: Check if store is properly configured
  if (!store) {
    console.error("❌ Redux store is undefined!");
    return <div>Redux configuration error</div>;
  }

  console.log("✅ Redux Provider ready with store");
  
  return <Provider store={store}>{children}</Provider>;
}