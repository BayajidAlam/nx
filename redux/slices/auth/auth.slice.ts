// redux/slices/auth/auth.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export interface User {
  userId: string;
  phone: string;
  role: string;
  eiin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Decode JWT token to get user info
const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<User>(token);
    return decoded;
  } catch {
    return null;
  }
};

// Get token from localStorage safely (client-side only)
const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true, // Start with true to check stored token
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Initialize auth state (check for stored token)
    initializeAuth: (state) => {
      const token = getStoredToken();
      if (token) {
        const user = decodeToken(token);
        if (user) {
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
        } else {
          // Token is invalid, remove it
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
          }
        }
      }
      state.loading = false;
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      const user = decodeToken(token);
      
      if (user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        
        // Store token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }
      }
      state.loading = false;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      // Remove token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Update user info
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  initializeAuth,
  loginSuccess,
  logout,
  setLoading,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;