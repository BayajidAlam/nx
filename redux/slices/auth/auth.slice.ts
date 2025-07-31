import { RootState } from "@/redux/root-reducer";
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

// Store access token (refresh token is httpOnly cookie managed by server)
const storeToken = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      // Store access token in localStorage
      localStorage.setItem("auth_token", token);
      
      // Also store in regular cookie for middleware compatibility
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1); // 1 day to match backend
      document.cookie = `auth_token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
      
      console.log("✅ Access token stored successfully");
      console.log("🍪 Refresh token managed by server as httpOnly cookie");
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

// Check if refresh token exists in cookies
const hasRefreshToken = (): boolean => {
  if (typeof window !== "undefined") {
    return document.cookie.includes('refresh_token=');
  }
  return false;
};

// Remove tokens (access token from localStorage, refresh token cookie cleared by server)
const removeToken = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("auth_token");
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Note: refresh_token cookie should be cleared by server on logout
      console.log("🧹 Access token removed, refresh token cookie should be cleared by server");
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
    // Initialize auth state (check for stored token and refresh token cookie)
    initializeAuth: (state) => {
      console.log("🔄 Initializing auth state...");
      const token = getStoredToken();
      const hasRefresh = hasRefreshToken();
      
      console.log("📱 Access token in localStorage:", !!token);
      console.log("🍪 Refresh token cookie exists:", hasRefresh);
      
      if (token) {
        const user = decodeToken(token);
        
        if (user) {
          console.log("✅ Access token is valid, user:", user);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
          // Ensure token is stored properly
          storeToken(token);
        } else {
          console.log("❌ Access token is invalid, removing...");
          removeToken();
        }
      } else if (hasRefresh) {
        console.log("🔄 No access token but refresh token exists - will attempt refresh on next API call");
        // Don't set authenticated yet, let the axios interceptor handle refresh
      } else {
        console.log("ℹ️ No tokens found");
      }
      
      state.loading = false;
      console.log("🏁 Auth initialization complete. Authenticated:", state.isAuthenticated);
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<string>) => {
      console.log("🚀 Login success action triggered");
      const token = action.payload;
      console.log("🔑 Received access token:", token);
      
      const user = decodeToken(token);
      
      if (user) {
        console.log("👤 Decoded user:", user);
        
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        
        // Store access token (refresh token already set as httpOnly cookie by server)
        storeToken(token);
        
        console.log("✅ Login state updated successfully");
        console.log("🍪 Refresh token should be set as httpOnly cookie by server");
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
      
      // Remove access token (server should clear refresh token cookie)
      removeToken();
      console.log("✅ Logout complete - server should clear refresh token cookie");
    },

    // Token refresh success (when axios interceptor refreshes token)
    tokenRefreshed: (state, action: PayloadAction<string>) => {
      console.log("🔄 Token refreshed successfully");
      const token = action.payload;
      const user = decodeToken(token);
      
      if (user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        storeToken(token);
        console.log("✅ Token refresh state updated");
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
  tokenRefreshed,
  setLoading,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;

// Enhanced selectors with proper typing
export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export const selectAuth = (state: RootState) => {
  console.log("🔍 selectAuth called, state.auth:", state.auth);
  return state.auth;
};

export const selectIsAuthenticated = (state: RootState) => state.auth?.isAuthenticated || false;
export const selectAuthLoading = (state: RootState) => state.auth?.loading || true;