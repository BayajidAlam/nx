import { axiosBaseQuery } from "@/lib/axios/axios-base-query";
import { createApi } from "@reduxjs/toolkit/query/react"; 
import { tagTypesList } from "./tag-types";

export const baseApi = createApi({
  reducerPath: "api", 
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
  keepUnusedDataFor: 60,
});