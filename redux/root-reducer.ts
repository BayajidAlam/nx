import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./base-api";
import fullScreenReducer from "./slices/full-screen/full-screen.slice";
import sidebarReducer from "./slices/sidebar/sidebar.slice";

export const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  fullScreen: fullScreenReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
