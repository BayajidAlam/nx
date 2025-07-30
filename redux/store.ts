import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./base-api";
import { globalInvalidationMiddleware } from "./middlewares/global-invalidation";
import { rootReducer } from "./root-reducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      baseApi.middleware,
      globalInvalidationMiddleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;