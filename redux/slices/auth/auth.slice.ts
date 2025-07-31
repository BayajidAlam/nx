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

// Store token in both localStorage and cookies
const storeToken = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      // Store in localStorage
      localStorage.setItem("auth_token", token);
      
      // Store in cookies for middleware
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      document.cookie = `auth_token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
      
      console.log("✅ Token stored successfully");
    } catch (error) {
      console.error("❌ Failed to store token:", error);
    }
  }
};

// Get token from localStorage safely (client-side only)
const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("auth_token");
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  }
  return null;
};

// Remove token from both places
const removeToken = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("auth_token");
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
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
      console.log("🔄 Initializing auth state...");
      const token = getStoredToken();
      
      if (token) {
        console.log("📱 Found stored token");
        const user = decodeToken(token);
        
        if (user) {
          console.log("✅ Token is valid, user:", user);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
          // Ensure token is stored in both places
          storeToken(token);
        } else {
          console.log("❌ Token is invalid, removing...");
          removeToken();
        }
      } else {
        console.log("ℹ️ No stored token found");
      }
      
      state.loading = false;
      console.log("🏁 Auth initialization complete. Authenticated:", state.isAuthenticated);
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<string>) => {
      console.log("🚀 Login success action triggered");
      const token = action.payload;
      console.log("🔑 Received token:", token);
      
      const user = decodeToken(token);
      
      if (user) {
        console.log("👤 Decoded user:", user);
        
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        
        // Store token in both localStorage and cookies
        storeToken(token);
        
        console.log("✅ Login state updated successfully");
      } else {
        console.log("❌ Failed to decode token");
      }
      
      state.loading = false;
    },

    // Logout
    logout: (state) => {
      console.log("👋 Logging out...");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      // Remove token from both localStorage and cookies
      removeToken();
      console.log("✅ Logout complete");
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