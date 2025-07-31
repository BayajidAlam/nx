// lib/axios/axios-instance.tsx
import { envConfig } from "@/config/env-config";
import { IGenericErrorResponse, ResponseSuccessType } from "@/types/common";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: envConfig.backendUrl,
  withCredentials: true, // CRITICAL: Enable cookies for refresh token
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

// Add a response interceptor - HANDLES COOKIES & TOKEN
axiosInstance.interceptors.response.use(
  function (response) {
    console.log("🔄 Axios raw response:", response.data);
    
    // Check if refresh token was set in cookies
    if (typeof window !== "undefined" && response.headers?.['set-cookie']) {
      console.log("🍪 Refresh token cookie set by server");
    }
    
    // PRESERVE ALL FIELDS including token
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
      success: response?.data?.success,
      message: response?.data?.message,
      // PRESERVE TOKEN (access token from response body)
      token: response?.data?.token,
      // Note: refresh_token is httpOnly cookie, not in response body
      ...response?.data,
    };
    
    console.log("✅ Axios processed response:", responseObject);
    return responseObject;
  },
  async function (error) {
    console.log("❌ Axios error:", error);
    
    // Handle token expiration - try refresh token first
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Check if we have a refresh token cookie
        const hasRefreshToken = document.cookie.includes('refresh_token=');
        
        if (hasRefreshToken) {
          try {
            // Try to refresh the access token
            console.log("🔄 Attempting token refresh...");
            const refreshResponse = await axiosInstance.post('/auth/refresh-token');
            
            if (refreshResponse.data.success && refreshResponse.data.token) {
              // Update stored token
              localStorage.setItem("auth_token", refreshResponse.data.token);
              
              // Retry the original request with new token
              error.config.headers["Authorization"] = `Bearer ${refreshResponse.data.token}`;
              return axiosInstance.request(error.config);
            }
          } catch (refreshError) {
            console.log("❌ Token refresh failed:", refreshError);
          }
        }
        
        // If refresh failed or no refresh token, logout
        localStorage.removeItem("auth_token");
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
      }
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
    return Promise.reject(responseObject);
  }
);

export { axiosInstance };