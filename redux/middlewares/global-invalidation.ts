/* eslint-disable @typescript-eslint/no-explicit-any */
import { Middleware } from "@reduxjs/toolkit";
import { baseApi } from "../base-api";
import { TAG_TYPES } from "../tag-types";

export const globalInvalidationMiddleware: Middleware =
  (store: any) => (next: any) => (action: any) => {
    if (
      action?.meta?.arg?.type === "mutation" &&
      action?.meta?.requestStatus === "fulfilled"
    ) {
      store.dispatch(baseApi.util.invalidateTags([TAG_TYPES.GLOBAL]));
    }

    return next(action);
  };
