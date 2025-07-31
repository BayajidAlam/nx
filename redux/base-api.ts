import { axiosBaseQuery } from "@/lib/axios/axios-base-query";
import { createApi } from "@reduxjs/toolkit/query";
import { tagTypesList } from "./tag-types";

export const baseApi = createApi({
  reducerPath: "",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
