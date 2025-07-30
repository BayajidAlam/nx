import { baseApi } from "@/redux/base-api";

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface SetPasswordRequest {
  password: string;
}

export interface ForgotPasswordRequest {
  phone: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Regular user login
    userLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Admin login
    adminLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/admin/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Send OTP for registration
    sendOtp: builder.mutation<ApiResponse, SendOtpRequest>({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        data,
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        data,
      }),
    }),

    // Set password after OTP verification
    setPassword: builder.mutation<ApiResponse, SetPasswordRequest>({
      query: (data) => ({
        url: "/auth/set-password",
        method: "POST",
        data,
      }),
    }),

    // Forgot password - send OTP
    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data,
      }),
    }),

    // Verify forgot password OTP
    verifyForgotPasswordOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-forgot-password-otp",
        method: "POST",
        data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        data,
      }),
    }),

    // Change password
    changePassword: builder.mutation<ApiResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation<ApiResponse, SendOtpRequest>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        data,
      }),
    }),
  }),
});

// CRITICAL: These exports must be here for the hooks to work
export const {
  useUserLoginMutation,
  useAdminLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSetPasswordMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useResendOtpMutation,
} = authApi;