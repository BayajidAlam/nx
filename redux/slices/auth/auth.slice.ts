// redux/slices/auth/auth.slice.ts - FIXED VERSION
import { AuthState, User } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


// Decode JWT token to get user info
const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<User>(token);
    return decoded;
  } catch {
    return null;
  }
};

// Get token from both localStorage and cookies
const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Try localStorage first
    let token = localStorage.getItem("auth_token");
    
    // If not in localStorage, try cookies
    if (!token) {
      token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1] || null;
    }
    
    return token;
  }
  return null;
};

// Store token in both localStorage and cookies
const storeToken = (token: string) => {
  if (typeof window !== "undefined") {
    // Store in localStorage
    localStorage.setItem("auth_token", token);
    
    // Store in cookies (expires in 7 days)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = `auth_token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
  }
};

// Remove token from both localStorage and cookies
const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
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
          // Ensure token is stored in both places
          storeToken(token);
        } else {
          // Token is invalid, remove it
          removeToken();
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
        
        // Store token in both localStorage and cookies
        storeToken(token);
      }
      state.loading = false;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      // Remove token from both localStorage and cookies
      removeToken();
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