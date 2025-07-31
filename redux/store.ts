// redux/store.ts - FIXED STORE CONFIGURATION
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./base-api";
import { rootReducer, type RootState } from "./root-reducer";

// Try to import global invalidation middleware, fallback if not found
let globalInvalidationMiddleware;
try {
  const middlewareModule = await import("./middlewares/global-invalidation");
  globalInvalidationMiddleware = middlewareModule.globalInvalidationMiddleware;
} catch (error) {
  console.log("Global invalidation middleware not found, skipping");
  globalInvalidationMiddleware = undefined;
}

const middlewares = [baseApi.middleware];
if (globalInvalidationMiddleware) {
  middlewares.push(globalInvalidationMiddleware);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(middlewares),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };

// Debug: Log initial state
if (typeof window !== "undefined") {
  console.log("🏪 Redux store initialized with state:", store.getState());
}