// hooks/use-store.ts - FIXED WITH CORRECT TYPES
import { store } from "@/redux/store";
import type { RootState } from "@/redux/root-reducer"; // Import from root-reducer, not store
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

export type AppDispatch = typeof store.dispatch;
// Use RootState from root-reducer to ensure consistency
export type { RootState };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Debug helper
export const useDebugStore = () => {
  const state = useSelector((state: RootState) => state);
  console.log("🐛 Current Redux state:", state);
  console.log("🐛 Auth slice exists:", !!state.auth);
  return state;
};