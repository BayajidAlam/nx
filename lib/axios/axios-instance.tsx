import { envConfig } from "@/config/env-config";
import { IGenericErrorResponse, ResponseSuccessType } from "@/types/common";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: envConfig.backendUrl,
});

axiosInstance.defaults.headers.post["Content-Type"] = "application/json";
axiosInstance.defaults.headers["Accept"] = "application/json";
axiosInstance.defaults.timeout = 100000;

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Get token from localStorage for client-side requests
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
      success: response?.data?.success,
      message: response?.data?.message,
    };
    return responseObject;
  },
  async function (error) {
    console.log(error);
    
    // Handle token expiration
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    
    const responseObject: IGenericErrorResponse = {
      error: {
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "Something went wrong",
      },
      success: error.response?.data?.success || false,
    };
    return responseObject;
  }
);

export { axiosInstance };