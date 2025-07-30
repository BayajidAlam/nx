import { axiosBaseQuery } from "@/lib/axios/axios-base-query";
import { createApi } from "@reduxjs/toolkit/query/react"; // CRITICAL: Must be /react
import { tagTypesList } from "./tag-types";

export const baseApi = createApi({
  reducerPath: "api", // Must match the key in root reducer
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
  keepUnusedDataFor: 60,
});