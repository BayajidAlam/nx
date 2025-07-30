import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./base-api";
import authReducer from "./slices/auth/auth.slice";
import fullScreenReducer from "./slices/full-screen/full-screen.slice";
import sidebarReducer from "./slices/sidebar/sidebar.slice";

export const rootReducer = combineReducers({
  auth: authReducer,
  sidebar: sidebarReducer,
  fullScreen: fullScreenReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
