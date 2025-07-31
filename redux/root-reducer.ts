// redux/root-reducer.ts - CLEAN ES6 VERSION
import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./base-api";
import authReducer from "./slices/auth/auth.slice";

// Simple fallback reducers (create these if you don't have the actual slices)
const fullScreenReducer = (state = { isFullScreen: false }, action: any) => {
  switch (action.type) {
    case 'fullScreen/toggle':
      return { ...state, isFullScreen: !state.isFullScreen };
    default:
      return state;
  }
};

const sidebarReducer = (state = { isSidebarOpen: true }, action: any) => {
  switch (action.type) {
    case 'sidebar/toggle':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  auth: authReducer, // CRITICAL: This must be here
  sidebar: sidebarReducer,
  fullScreen: fullScreenReducer,
  api: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Debug logging
console.log("🏗️ Root reducer configured with auth slice");